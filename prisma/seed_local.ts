import { PrismaClient } from "@prisma/client";
import { Argon2id } from "oslo/password";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 [SEED] Starting microservices local seed...");

  // 1. Create a Business Unit (Organization)
  const businessUnit = await prisma.businessUnit.create({
    data: {
      name: "Furcare Global",
      type: "Clinic",
    },
  });
  console.log(`✅ [SEED] Created Organization: ${businessUnit.name}`);

  // 2. Create a Branch
  const branch = await prisma.businessBranch.create({
    data: {
      businessUnitId: businessUnit.id,
      name: "Furcare Local Clinic",
      type: "Main",
      practice: "Small Animal",
      currency: "INR",
      addressLine1: "123 Microservice Lane",
      addressLine2: "Unit 1",
      city: "Dev City",
      state: "Localhost",
      country: "Docker",
      postalCode: "10101",
      active: true,
    },
  });
  console.log(`✅ [SEED] Created Branch: ${branch.name} (${branch.id})`);

  // 3. Create an Admin Role
  const role = await prisma.role.create({
    data: {
      name: "Clinic Manager",
      businessUnitId: businessUnit.id,
      accessLevel: "businessBranch",
      businessBranchId: branch.id,
      isStaff: true,
      active: true,
    },
  });
  console.log(`✅ [SEED] Created Role: ${role.name}`);

  // 4. Create a Staff User
  const passwordHash = await new Argon2id().hash("123456");
  const staff = await prisma.staff.create({
    data: {
      name: "Local Admin",
      email: "test@furcare.in",
      phone: "9999999999",
      password: passwordHash,
      businessBranchId: branch.id,
      onboardingCompleted: true,
      active: true,
      roles: {
        create: {
          roleId: role.id,
        },
      },
    },
  });
  console.log(`✅ [SEED] Created Staff: ${staff.email} (Password: 123456)`);

  // 5. Create an Animal Class
  const dogClass = await prisma.animalClass.create({
    data: {
      name: "Canine",
    },
  });
  console.log(`✅ [SEED] Created Animal Class: ${dogClass.name}`);

  // 6. Create a Client (Owner)
  const client = await prisma.client.create({
    data: {
      clientId: "C-001",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "9876543210",
      address: "456 Owner Rd",
      city: "Barkville",
      state: "Pet State",
      country: "Petland",
      postalCode: "10101",
      businessBranchId: branch.id,
    },
  });
  console.log(`✅ [SEED] Created Client: ${client.firstName} ${client.lastName}`);

  // 7. Create a Pet (Patient) - "Buddy"
  const pet = await prisma.pet.create({
    data: {
      name: "Buddy",
      gender: "male",
      dob: new Date("2020-01-01"),
      weight: 25.5,
      animalClassId: dogClass.id,
      breed: "Golden Retriever",
      color: "Golden",
      sterilizationStatus: "sterilized",
      patientType: "Regular",
      clientId: client.id,
    },
  });
  console.log(`✅ [SEED] Created Pet: ${pet.name} (Species: ${dogClass.name})`);

  // 8. Create a Visit (History)
  const visit = await prisma.visit.create({
    data: {
      petId: pet.id,
      clientId: client.id,
      businessBranchId: branch.id,
      date: new Date(),
      reason: "General Checkup",
      notes: "Healthy dog. Heart rate normal. Vaccination up to date.",
      status: "Completed",
    },
  });
  console.log(`✅ [SEED] Created Visit History for ${pet.name}`);

  console.log("🏁 [SEED] Local seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ [SEED] Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
