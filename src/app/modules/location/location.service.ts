import prisma from "../../../utils/prisma.js";

const createLocation = async (data: { name: string }) => {
    return prisma.location.create({ data });
};

const getLocationById = async (id: string) => {
    return prisma.location.findUnique({ where: { id } });
};

const updateLocation = async (id: string, data: { name: string }) => {
    return prisma.location.update({ where: { id }, data });
};

const deleteLocation = async (id: string) => {
    return prisma.location.delete({ where: { id } });
};

const getLocationsByBranch = async (branchId: string) => {
    const links = await prisma.locationsToBranches.findMany({
        where: { branchId },
        include: { locationDetails: true },
    });
    return links.map((l) => ({ ...l.locationDetails, linkId: l.id }));
};

const linkLocationToBranch = async (locationId: string, businessBranchId: string) => {
    return prisma.locationsToBranches.create({
        data: { locationId, branchId: businessBranchId },
    });
};

const unlinkLocationFromBranch = async (locationId: string) => {
    return prisma.locationsToBranches.deleteMany({ where: { locationId } });
};

const locationService = {
    createLocation,
    getLocationById,
    updateLocation,
    deleteLocation,
    getLocationsByBranch,
    linkLocationToBranch,
    unlinkLocationFromBranch,
};

export default locationService;
