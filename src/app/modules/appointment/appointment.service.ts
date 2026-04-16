import prisma from "../../../utils/prisma.js";

const isValidObjectId = (value?: string | null) =>
  typeof value === "string" && /^[0-9a-fA-F]{24}$/.test(value);

const parseAppointmentDateTime = (dateStr?: string, timeStr?: string) => {
  if (!dateStr) return new Date();
  const base = new Date(`${dateStr}T00:00:00`);
  if (!timeStr) return base;

  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return base;

  let hours = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  base.setHours(hours, minutes, 0, 0);
  return base;
};

const resolveClientObjectId = async (clientRef?: string) => {
  if (!clientRef) return null;
  if (isValidObjectId(clientRef)) return clientRef;

  const client = await prisma.client.findFirst({
    where: { clientId: clientRef },
    select: { id: true },
  });

  return client?.id ?? null;
};

const createLinkedVisitsForAppointment = async (data: any, appointmentId: string) => {
  const clientObjectId = await resolveClientObjectId(data?.clientId);
  const branchObjectId = isValidObjectId(data?.branchId) ? data.branchId : null;
  const petIds = Array.isArray(data?.petId) ? data.petId : [];

  if (!clientObjectId || !branchObjectId || petIds.length === 0) return;

  const appointmentDate = parseAppointmentDateTime(data?.appointmentDate, data?.appointmentTime);
  const reason = data?.appointmentType
    ? `Appointment - ${data.appointmentType}`
    : "Appointment";

  const validPetIds = petIds.filter((petId: string) => isValidObjectId(petId));
  if (validPetIds.length === 0) return;

  // Resolve Doctor's Name for 'author' field
  let doctorName = "Unknown";
  if (data?.doctorId && isValidObjectId(data.doctorId)) {
    const doctor = await prisma.staff.findUnique({
      where: { id: data.doctorId },
      select: { name: true }
    });
    if (doctor?.name) {
      doctorName = doctor.name;
    }
  }

  await prisma.visit.createMany({
    data: validPetIds.map((petId: string) => ({
      date: appointmentDate,
      reason,
      notes: data?.comment || null,
      status: "Scheduled",
      clientId: clientObjectId,
      petId,
      moduleId: appointmentId,
      businessBranchId: branchObjectId,
      author: doctorName,
    })),
  });
};

const getAllAppointments = async (filters: { branchId?: string; startDate?: string; endDate?: string } = {}) => {
  const whereClause: any = { active: true };

  if (filters.branchId) {
    whereClause.branchId = filters.branchId;
  }

  if (filters.startDate || filters.endDate) {
    whereClause.appointmentDate = {};
    if (filters.startDate) {
      whereClause.appointmentDate.gte = filters.startDate;
    }
    if (filters.endDate) {
      whereClause.appointmentDate.lte = filters.endDate;
    }
  }

  return await prisma.appointment.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });
}

const getAppointmentById = async (id : string) => {
  return await prisma.appointment.findMany({
    where: { id, active: true },
  });
}

const getAppointmentByBranchId = async (branchId : string ) => {
  return await prisma.appointment.findMany({
    where: { branchId, active: true },
    orderBy: { appointmentDate: "asc" },
  });
}

const createAppointment = async (data : any) => {
  const appointment = await prisma.appointment.create({ data });
  await createLinkedVisitsForAppointment(data, appointment.id);
  return appointment;
}

const updateAppointment = async (id : string ,data : any) => {
  const appointment = await prisma.appointment.update({ where: { id }, data });

  // Re-sync future/scheduled linked visits with latest appointment details.
  await prisma.visit.deleteMany({
    where: {
      moduleId: id,
      status: "Scheduled",
    },
  });

  await createLinkedVisitsForAppointment({ ...appointment, ...data }, id);
  return appointment;
}

const deleteAppointment = async (id : string ) => {
  const appointment = await prisma.appointment.update({
    where: { id },
    data: { active: false },
  });

  await prisma.visit.updateMany({
    where: {
      moduleId: id,
      status: "Scheduled",
    },
    data: {
      status: "Cancelled",
    },
  });

  return appointment;
}

const appointmentServices = {
  getAllAppointments,
  createAppointment,
  deleteAppointment, 
  updateAppointment, 
  getAppointmentByBranchId, 
  getAppointmentById, 
};
export default appointmentServices;
