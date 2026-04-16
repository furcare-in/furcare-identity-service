import prisma from "../../../utils/prisma.js";

const getAppointmentSlotsByBranchId = async (branchId: string) => {
    return prisma.appointmentSlot.findMany({
        where: { branchId },
        include: { department: true },
    });
};

const createAppointmentSlot = async (data: any) => {
    return prisma.appointmentSlot.create({ data });
};

const getAppointmentSlots = async (filters: any) => {
    return prisma.appointmentSlot.findMany({ where: filters });
};

const deleteAppointmentSlot = async (id: string) => {
    return prisma.appointmentSlot.delete({ where: { id } });
};

const departmentAppointmentService = {
    getAppointmentSlotsByBranchId,
    createAppointmentSlot,
    getAppointmentSlots,
    deleteAppointmentSlot,
};

export default departmentAppointmentService;
