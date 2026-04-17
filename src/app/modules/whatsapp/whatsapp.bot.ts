// @ts-nocheck
// @ts-nocheck
import prisma from "../../../utils/prisma.js";
import env from "../../../utils/env.js";

// ─── Types ─────────────────────────────────────────────────────────────────

type BotState =
  | "IDLE"
  | "BOOK_PET_NAME" | "BOOK_PET_AGE" | "BOOK_PET_BREED" | "BOOK_ANIMAL_CLASS"
  | "BOOK_STATE" | "BOOK_CITY" | "BOOK_PINCODE"
  | "BOOK_CLINIC_SELECT"
  | "BOOK_SLOT_DATE" | "BOOK_SLOT_TIME"
  | "BOOK_REASON"
  | "QUERY_MENU"
  | "QUERY_CANCEL_ID"
  | "QUERY_POSTPONE_ID" | "QUERY_POSTPONE_SLOT"
  | "QUERY_PREPONE_ID" | "QUERY_PREPONE_SLOT";

interface BotSession {
  state: BotState;
  data: Record<string, any>;
  lastActivity: number;
  convId: string;
}

// ─── Session store (in-memory, 5-min TTL) ─────────────────────────────────

const SESSION_TTL = 5 * 60 * 1000;
const sessions = new Map<string, BotSession>();

function getOrCreateSession(phone: string, convId: string): { session: BotSession; isNew: boolean } {
  const now = Date.now();
  const existing = sessions.get(phone);
  if (existing && now - existing.lastActivity < SESSION_TTL) {
    existing.lastActivity = now;
    existing.convId = convId;
    return { session: existing, isNew: false };
  }
  const session: BotSession = { state: "IDLE", data: {}, lastActivity: now, convId };
  sessions.set(phone, session);
  return { session, isNew: true };
}

function resetSession(phone: string, convId: string): void {
  sessions.set(phone, { state: "IDLE", data: {}, lastActivity: Date.now(), convId });
}

// Purge stale sessions every minute — send a goodbye before expiring
setInterval(async () => {
  const now = Date.now();
  for (const [phone, s] of sessions.entries()) {
    if (now - s.lastActivity > SESSION_TTL) {
      sessions.delete(phone);
      try {
        await send(
          phone,
          s.convId,
          "We noticed you've been inactive for a while.\n\nThank you for reaching out to *FurcareIndia*! We hope to see you and your furry friend soon. Take care! 🐾"
        );
      } catch {
        // silently ignore
      }
    }
  }
}, 60_000);

// ─── WhatsApp API helpers ──────────────────────────────────────────────────

const GRAPH_URL = `https://graph.facebook.com/${env.whatsapp.apiVersion}`;
const BANNER_URL = "https://backend.furcareindia.com/logo.png";

async function send(phone: string, convId: string, text: string): Promise<void> {
  const res = await fetch(`${GRAPH_URL}/${env.whatsapp.phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.whatsapp.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone,
      type: "text",
      text: { body: text },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WA send error ${res.status}: ${err}`);
  }

  const data: any = await res.json();
  const waMessageId: string = data?.messages?.[0]?.id ?? "bot";

  await prisma.whatsAppMessage.create({
    data: { conversationId: convId, waMessageId, direction: "outbound", body: text, type: "text", status: "sent" },
  });
  await prisma.whatsAppConversation.update({
    where: { id: Number(convId) },
    data: { lastMessage: text, lastMessageTime: new Date() },
  });
}

async function sendButtons(
  phone: string,
  convId: string,
  bodyText: string,
  buttons: Array<{ id: string; title: string }>,
  imageUrl?: string
): Promise<void> {
  const interactive: any = {
    type: "button",
    body: { text: bodyText },
    action: {
      buttons: buttons.map((b) => ({ type: "reply", reply: { id: b.id, title: b.title } })),
    },
  };

  if (imageUrl) {
    interactive.header = { type: "image", image: { link: imageUrl } };
  }

  const res = await fetch(`${GRAPH_URL}/${env.whatsapp.phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.whatsapp.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messaging_product: "whatsapp", to: phone, type: "interactive", interactive }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WA sendButtons error ${res.status}: ${err}`);
  }

  const data: any = await res.json();
  const waMessageId: string = data?.messages?.[0]?.id ?? "bot";

  await prisma.whatsAppMessage.create({
    data: { conversationId: convId, waMessageId, direction: "outbound", body: bodyText, type: "interactive", status: "sent" },
  });
  await prisma.whatsAppConversation.update({
    where: { id: Number(convId) },
    data: { lastMessage: bodyText, lastMessageTime: new Date() },
  });
}

async function sendList(
  phone: string,
  convId: string,
  bodyText: string,
  buttonLabel: string,
  sections: Array<{ title: string; rows: Array<{ id: string; title: string; description?: string }> }>
): Promise<void> {
  const res = await fetch(`${GRAPH_URL}/${env.whatsapp.phoneNumberId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.whatsapp.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: phone,
      type: "interactive",
      interactive: {
        type: "list",
        body: { text: bodyText },
        action: { button: buttonLabel, sections },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`WA sendList error ${res.status}: ${err}`);
  }

  const data: any = await res.json();
  const waMessageId: string = data?.messages?.[0]?.id ?? "bot";

  await prisma.whatsAppMessage.create({
    data: { conversationId: convId, waMessageId, direction: "outbound", body: bodyText, type: "interactive", status: "sent" },
  });
  await prisma.whatsAppConversation.update({
    where: { id: Number(convId) },
    data: { lastMessage: bodyText, lastMessageTime: new Date() },
  });
}

// ─── Slot / date helpers ───────────────────────────────────────────────────

const SLOT_TIMES = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

function getWorkingDates(from: Date, count: number): string[] {
  const result: string[] = [];
  const d = new Date(from);
  while (result.length < count) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0) result.push(toDateStr(d));
  }
  return result;
}

async function getAvailableSlots(branchId: string, date: string): Promise<string[]> {
  const booked = await prisma.appointment.findMany({
    where: { branchId, appointmentDate: date, active: true },
    select: { appointmentTime: true },
  });
  const bookedSet = new Set(booked.map((a) => a.appointmentTime));
  return SLOT_TIMES.filter((t) => !bookedSet.has(t));
}

async function getSlotOptions(branchId: string, dates: string[]): Promise<Array<{ date: string; time: string; label: string }>> {
  const options: Array<{ date: string; time: string; label: string }> = [];
  for (const date of dates) {
    const slots = await getAvailableSlots(branchId, date);
    for (const time of slots) {
      options.push({ date, time, label: `${formatDateLabel(date)} at ${time}` });
    }
    if (options.length >= 20) break;
  }
  return options;
}

async function getDoctorForBranch(branchId: string): Promise<string> {
  const assignment = await prisma.staffToBranches.findFirst({
    where: { branchId: Number(branchId) },
    select: { staffId: true },
  });
  return assignment?.staffId ?? "UNASSIGNED";
}

// ─── Shared menu senders ──────────────────────────────────────────────────

const MAIN_MENU_BUTTONS = [
  { id: "1", title: "About Furcare" },
  { id: "2", title: "Book an appointment" },
  { id: "3", title: "Appointment queries" },
];

const QUERY_BUTTONS = [
  { id: "1", title: "Cancel appointment" },
  { id: "2", title: "Postpone appointment" },
  { id: "3", title: "Prepone appointment" },
];

async function showMainMenu(phone: string, convId: string, bodyText: string, withBanner = false): Promise<void> {
  await sendButtons(phone, convId, bodyText, MAIN_MENU_BUTTONS, withBanner ? BANNER_URL : undefined);
}

async function showQueryMenu(phone: string, convId: string): Promise<void> {
  await sendButtons(
    phone,
    convId,
    "*Appointment Queries*\n\nWhat would you like to do?",
    QUERY_BUTTONS
  );
}

const EXIT_TEXT = "Thank you for contacting FurcareIndia! Have a great day. See you next time. 🐾";

// ─── Main entry point ──────────────────────────────────────────────────────

export async function handleBotMessage(phone: string, convId: string, rawText: string): Promise<void> {
  const text = rawText.trim();

  if (/^exit$/i.test(text)) {
    resetSession(phone, convId);
    await send(phone, convId, EXIT_TEXT);
    return;
  }

  const { session, isNew } = getOrCreateSession(phone, convId);

  if (isNew) {
    await showMainMenu(
      phone,
      convId,
      "*Welcome to FurcareIndia!*\n\nHow can we help you today?",
      true
    );
    return;
  }

  switch (session.state) {
    case "IDLE":
      await handleIdle(phone, convId, text, session);
      break;

    case "BOOK_PET_NAME":
      session.data.petName = text;
      session.state = "BOOK_PET_AGE";
      await send(phone, convId, "Please enter your pet's age:\n_(e.g. 2 years, 6 months)_");
      break;

    case "BOOK_PET_AGE":
      session.data.petAge = text;
      session.state = "BOOK_PET_BREED";
      await send(phone, convId, "Please enter your pet's breed:");
      break;

    case "BOOK_PET_BREED":
      session.data.petBreed = text;
      session.state = "BOOK_ANIMAL_CLASS";
      await send(phone, convId, "Please enter your pet's animal class:\n_(e.g. Dog, Cat, Bird, Rabbit)_");
      break;

    case "BOOK_ANIMAL_CLASS":
      session.data.animalClass = text;
      session.state = "BOOK_STATE";
      await send(phone, convId, "Please enter your state:\n_(e.g. Maharashtra, Karnataka)_");
      break;

    case "BOOK_STATE":
      session.data.bookingState = text;
      session.state = "BOOK_CITY";
      await send(phone, convId, "Please enter your city:");
      break;

    case "BOOK_CITY":
      session.data.bookingCity = text;
      session.state = "BOOK_PINCODE";
      await send(phone, convId, "Please enter your pincode:");
      break;

    case "BOOK_PINCODE":
      session.data.bookingPincode = text;
      await handleClinicSearch(phone, convId, session);
      break;

    case "BOOK_CLINIC_SELECT":
      await handleClinicSelect(phone, convId, text, session);
      break;

    case "BOOK_SLOT_DATE":
      await handleSlotDateSelect(phone, convId, text, session);
      break;

    case "BOOK_SLOT_TIME":
      await handleSlotTimeSelect(phone, convId, text, session);
      break;

    case "BOOK_REASON":
      await handleBookingReason(phone, convId, text, session);
      break;

    case "QUERY_MENU":
      await handleQueryMenu(phone, convId, text, session);
      break;

    case "QUERY_CANCEL_ID":
      await handleCancelAppointment(phone, convId, text, session);
      break;

    case "QUERY_POSTPONE_ID":
      await handlePostponeId(phone, convId, text, session);
      break;

    case "QUERY_POSTPONE_SLOT":
      await handleChangeSlotSelect(phone, convId, text, session, "postpone");
      break;

    case "QUERY_PREPONE_ID":
      await handlePreponeId(phone, convId, text, session);
      break;

    case "QUERY_PREPONE_SLOT":
      await handleChangeSlotSelect(phone, convId, text, session, "prepone");
      break;

    default:
      resetSession(phone, convId);
      await showMainMenu(phone, convId, "*Welcome to FurcareIndia!*\n\nHow can we help you today?");
  }
}

// ─── State handlers ────────────────────────────────────────────────────────

async function handleIdle(phone: string, convId: string, text: string, session: BotSession) {
  switch (text) {
    case "1": {
      const info =
        "*About FurcareIndia*\n\n" +
        "FurcareIndia is a network of trusted veterinary clinics dedicated to the health and happiness of your pets.\n\n" +
        "We partner with certified veterinarians across India to provide top-quality care.\n\n" +
        "🌐 https://furcareindia.com/";
      await send(phone, convId, info);
      await showMainMenu(phone, convId, "How else can we help you?");
      break;
    }
    case "2":
      session.state = "BOOK_PET_NAME";
      await send(phone, convId, "Great! Let's book an appointment. 🐾\n\nPlease enter your *pet's name:*");
      break;
    case "3":
      session.state = "QUERY_MENU";
      await showQueryMenu(phone, convId);
      break;
    default:
      await showMainMenu(phone, convId, "*Welcome to FurcareIndia!*\n\nHow can we help you today?");
  }
}

async function handleClinicSearch(phone: string, convId: string, session: BotSession) {
  const { bookingState, bookingCity } = session.data;

  let branches = await prisma.businessBranch.findMany({
    where: {
      active: true,
      state: { equals: bookingState, mode: "insensitive" },
      city: { equals: bookingCity, mode: "insensitive" },
    },
    select: { id: true, name: true, city: true, state: true },
    orderBy: { name: "asc" },
  });

  if (branches.length === 0) {
    branches = await prisma.businessBranch.findMany({
      where: { active: true, state: { equals: bookingState, mode: "insensitive" } },
      select: { id: true, name: true, city: true, state: true },
      orderBy: { name: "asc" },
    });
  }

  if (branches.length === 0) {
    await send(
      phone,
      convId,
      `Sorry, we could not find any FurcareIndia clinics in ${bookingCity}, ${bookingState}.\n\nPlease visit https://furcareindia.com/ or try again with a different city.`
    );
    resetSession(phone, convId);
    await showMainMenu(phone, convId, "*Welcome to FurcareIndia!*\n\nHow can we help you today?");
    return;
  }

  // Cap at 10 — WhatsApp list rows limit
  const capped = branches.slice(0, 10);
  session.data.clinics = capped;
  session.state = "BOOK_CLINIC_SELECT";

  await sendList(
    phone,
    convId,
    `*Clinics near you* — ${bookingCity}, ${bookingState}\n\nTap below to select your preferred clinic:`,
    "Select Clinic",
    [
      {
        title: "Available Clinics",
        rows: capped.map((b, i) => ({
          id: String(i + 1),
          title: b.name.substring(0, 24),
          description: `${b.city}, ${b.state}`,
        })),
      },
    ]
  );
}

async function handleClinicSelect(phone: string, convId: string, text: string, session: BotSession) {
  const clinics: any[] = session.data.clinics ?? [];
  const idx = parseInt(text, 10) - 1;

  if (isNaN(idx) || idx < 0 || idx >= clinics.length) {
    await sendList(
      phone,
      convId,
      "Please select a clinic from the list:",
      "Select Clinic",
      [
        {
          title: "Available Clinics",
          rows: clinics.map((b, i) => ({
            id: String(i + 1),
            title: b.name.substring(0, 24),
            description: `${b.city}, ${b.state}`,
          })),
        },
      ]
    );
    return;
  }

  const clinic = clinics[idx];
  session.data.selectedBranchId = clinic.id;
  session.data.selectedBranchName = clinic.name;

  const dates = getWorkingDates(new Date(), 7);
  session.data.availableDates = dates;
  session.state = "BOOK_SLOT_DATE";

  await sendList(
    phone,
    convId,
    `*Clinic:* ${clinic.name}\n\nChoose your preferred appointment date:`,
    "Select Date",
    [
      {
        title: "Available Dates",
        rows: dates.map((d, i) => ({ id: String(i + 1), title: formatDateLabel(d) })),
      },
    ]
  );
}

async function handleSlotDateSelect(phone: string, convId: string, text: string, session: BotSession) {
  const dates: string[] = session.data.availableDates ?? [];
  const idx = parseInt(text, 10) - 1;

  if (isNaN(idx) || idx < 0 || idx >= dates.length) {
    await sendList(
      phone,
      convId,
      "Please select a date from the list:",
      "Select Date",
      [
        {
          title: "Available Dates",
          rows: dates.map((d, i) => ({ id: String(i + 1), title: formatDateLabel(d) })),
        },
      ]
    );
    return;
  }

  const selectedDate = dates[idx];
  const available = await getAvailableSlots(session.data.selectedBranchId, selectedDate);

  if (available.length === 0) {
    await sendList(
      phone,
      convId,
      `No slots available on ${formatDateLabel(selectedDate)}. Please choose a different date:`,
      "Select Date",
      [
        {
          title: "Available Dates",
          rows: dates.map((d, i) => ({ id: String(i + 1), title: formatDateLabel(d) })),
        },
      ]
    );
    return;
  }

  session.data.selectedDate = selectedDate;
  session.data.availableTimeSlots = available;
  session.state = "BOOK_SLOT_TIME";

  await sendList(
    phone,
    convId,
    `*Date:* ${formatDateLabel(selectedDate)}\n\nChoose a time slot:`,
    "Select Time",
    [
      {
        title: "Available Times",
        rows: available.map((t, i) => ({ id: String(i + 1), title: t })),
      },
    ]
  );
}

async function handleSlotTimeSelect(phone: string, convId: string, text: string, session: BotSession) {
  const slots: string[] = session.data.availableTimeSlots ?? [];
  const idx = parseInt(text, 10) - 1;

  if (isNaN(idx) || idx < 0 || idx >= slots.length) {
    await sendList(
      phone,
      convId,
      "Please select a time from the list:",
      "Select Time",
      [
        {
          title: "Available Times",
          rows: slots.map((t, i) => ({ id: String(i + 1), title: t })),
        },
      ]
    );
    return;
  }

  session.data.selectedTime = slots[idx];
  session.state = "BOOK_REASON";
  await send(
    phone,
    convId,
    `*Slot confirmed:* ${slots[idx]} on ${formatDateLabel(session.data.selectedDate)} ✅\n\nPlease describe the reason for your visit:`
  );
}

async function handleBookingReason(phone: string, convId: string, text: string, session: BotSession) {
  const { petName, petAge, petBreed, animalClass, selectedBranchId, selectedBranchName, selectedDate, selectedTime } =
    session.data;

  const doctorId = await getDoctorForBranch(selectedBranchId);

  const appointment = await prisma.appointment.create({
    data: {
      clientId: `WA:${phone}`,
      name: `WhatsApp Booking - ${petName}`,
      appointmentType: "Regular",
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      doctorId,
      comment: text,
      branchId: selectedBranchId,
      petId: [],
      petNames: [petName],
      active: true,
    },
  });

  resetSession(phone, convId);

  const summary =
    "*Appointment Confirmed!* ✅\n\n" +
    `*ID:* \`${appointment.id}\`\n\n` +
    `*Pet:* ${petName} (${animalClass}, ${petBreed}, Age: ${petAge})\n` +
    `*Clinic:* ${selectedBranchName}\n` +
    `*Date:* ${formatDateLabel(selectedDate)}\n` +
    `*Time:* ${selectedTime}\n` +
    `*Reason:* ${text}\n\n` +
    "─────────────────────\n" +
    "Please save your *Appointment ID* — you'll need it to cancel, postpone, or prepone.\n\n" +
    "Type *exit* to end the chat, or send any message to return to the main menu.\n" +
    "_No response? We'll wrap up automatically in 5 minutes._";

  await send(phone, convId, summary);
}

// ─── Query menu ────────────────────────────────────────────────────────────

async function handleQueryMenu(phone: string, convId: string, text: string, session: BotSession) {
  switch (text) {
    case "1":
      session.state = "QUERY_CANCEL_ID";
      await send(phone, convId, "Please enter your *Appointment ID* to cancel:");
      break;
    case "2":
      session.state = "QUERY_POSTPONE_ID";
      await send(phone, convId, "Please enter your *Appointment ID* to postpone:");
      break;
    case "3":
      session.state = "QUERY_PREPONE_ID";
      await send(phone, convId, "Please enter your *Appointment ID* to prepone:");
      break;
    default:
      await showQueryMenu(phone, convId);
  }
}

async function handleCancelAppointment(phone: string, convId: string, appointmentId: string, _session: BotSession) {
  const id = appointmentId.trim();
  const appointment = await prisma.appointment.findFirst({ where: { id, active: true } });

  if (!appointment) {
    await send(phone, convId, "Appointment not found. Please check the ID and try again.\n\nOr type *exit* to end the chat.");
    return;
  }

  await prisma.appointment.update({ where: { id: Number(id) }, data: { active: false } });
  await prisma.visit.updateMany({ where: { moduleId: id, status: "Scheduled" }, data: { status: "Cancelled" } });

  resetSession(phone, convId);
  await send(
    phone,
    convId,
    `Your appointment on *${formatDateLabel(appointment.appointmentDate)}* at *${appointment.appointmentTime}* has been *cancelled*. ✅\n\nType *exit* to end the chat or send any message to return to the main menu.`
  );
}

async function handlePostponeId(phone: string, convId: string, appointmentId: string, session: BotSession) {
  const id = appointmentId.trim();
  const appointment = await prisma.appointment.findFirst({ where: { id, active: true } });

  if (!appointment) {
    await send(phone, convId, "Appointment not found. Please check the ID and try again.\n\nOr type *exit* to end the chat.");
    return;
  }

  const currentDate = new Date(appointment.appointmentDate + "T00:00:00");
  const maxDate = new Date(currentDate);
  maxDate.setDate(maxDate.getDate() + 7);

  const dates: string[] = [];
  const d = new Date(currentDate);
  while (d <= maxDate) {
    d.setDate(d.getDate() + 1);
    const ds = toDateStr(d);
    if (d.getDay() !== 0 && ds > appointment.appointmentDate) dates.push(ds);
  }

  const options = await getSlotOptions(appointment.branchId, dates);

  if (options.length === 0) {
    await send(
      phone,
      convId,
      `No available slots found within 7 days after ${formatDateLabel(appointment.appointmentDate)}.\n\nPlease contact us at https://furcareindia.com/`
    );
    resetSession(phone, convId);
    await showMainMenu(phone, convId, "*Welcome to FurcareIndia!*\n\nHow can we help you today?");
    return;
  }

  session.data.appointmentIdForQuery = id;
  session.data.slotsForChange = options;
  session.state = "QUERY_POSTPONE_SLOT";

  // Group slots by date into sections
  const sections = buildSlotSections(options);

  await sendList(
    phone,
    convId,
    `*Current appointment:*\n${formatDateLabel(appointment.appointmentDate)} at ${appointment.appointmentTime}\n\nSelect a new slot to postpone to:`,
    "Select Slot",
    sections
  );
}

async function handlePreponeId(phone: string, convId: string, appointmentId: string, session: BotSession) {
  const id = appointmentId.trim();
  const appointment = await prisma.appointment.findFirst({ where: { id, active: true } });

  if (!appointment) {
    await send(phone, convId, "Appointment not found. Please check the ID and try again.\n\nOr type *exit* to end the chat.");
    return;
  }

  const today = new Date();
  const currentApptDate = new Date(appointment.appointmentDate + "T00:00:00");
  const daysDiff = Math.floor((currentApptDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysDiff <= 1) {
    await send(
      phone,
      convId,
      "Your appointment is too soon — there are no earlier slots available to prepone.\n\nType *exit* to end the chat or send any message to return to the main menu."
    );
    resetSession(phone, convId);
    return;
  }

  const dates: string[] = [];
  const d = new Date(today);
  while (true) {
    d.setDate(d.getDate() + 1);
    const ds = toDateStr(d);
    if (ds >= appointment.appointmentDate) break;
    if (d.getDay() !== 0) dates.push(ds);
  }

  const options = await getSlotOptions(appointment.branchId, dates);

  if (options.length === 0) {
    await send(
      phone,
      convId,
      `No earlier slots available before ${formatDateLabel(appointment.appointmentDate)}.\n\nPlease contact us at https://furcareindia.com/`
    );
    resetSession(phone, convId);
    await showMainMenu(phone, convId, "*Welcome to FurcareIndia!*\n\nHow can we help you today?");
    return;
  }

  session.data.appointmentIdForQuery = id;
  session.data.slotsForChange = options;
  session.state = "QUERY_PREPONE_SLOT";

  const sections = buildSlotSections(options);

  await sendList(
    phone,
    convId,
    `*Current appointment:*\n${formatDateLabel(appointment.appointmentDate)} at ${appointment.appointmentTime}\n\nSelect an earlier slot:`,
    "Select Slot",
    sections
  );
}

// Build WhatsApp list sections grouped by date (for postpone/prepone)
function buildSlotSections(
  options: Array<{ date: string; time: string; label: string }>
): Array<{ title: string; rows: Array<{ id: string; title: string }> }> {
  const byDate = new Map<string, typeof options>();
  for (const opt of options) {
    if (!byDate.has(opt.date)) byDate.set(opt.date, []);
    byDate.get(opt.date)!.push(opt);
  }

  const sections: Array<{ title: string; rows: Array<{ id: string; title: string }> }> = [];
  for (const [date, slots] of byDate.entries()) {
    sections.push({
      title: formatDateShort(date).substring(0, 24),
      rows: slots.map((s) => ({
        id: String(options.indexOf(s) + 1),
        title: s.time,
      })),
    });
    if (sections.length >= 10) break; // WhatsApp max 10 sections
  }

  return sections;
}

async function handleChangeSlotSelect(
  phone: string,
  convId: string,
  text: string,
  session: BotSession,
  type: "postpone" | "prepone"
) {
  const options: Array<{ date: string; time: string; label: string }> = session.data.slotsForChange ?? [];
  const idx = parseInt(text, 10) - 1;

  if (isNaN(idx) || idx < 0 || idx >= options.length) {
    await send(phone, convId, "Invalid selection. Please choose from the list.");
    return;
  }

  const chosen = options[idx];
  const id = session.data.appointmentIdForQuery;

  await prisma.appointment.update({
    where: { id: Number(id) },
    data: { appointmentDate: chosen.date, appointmentTime: chosen.time },
  });

  await prisma.visit.updateMany({
    where: { moduleId: id, status: "Scheduled" },
    data: { date: new Date(chosen.date + "T00:00:00") },
  });

  resetSession(phone, convId);
  const verb = type === "postpone" ? "postponed" : "preponed";
  await send(
    phone,
    convId,
    `Your appointment has been *${verb}* to:\n\n*${formatDateLabel(chosen.date)}* at *${chosen.time}* ✅\n\nType *exit* to end the chat or send any message to return to the main menu.`
  );
}
