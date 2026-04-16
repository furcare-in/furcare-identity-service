import { Router } from "express";
import businessBranchController from "./businessBranch.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import businessBranchValidator from "./businessBranch.validator.js";

const businessBranchRouter = Router();

businessBranchRouter
  .route("/")
  .post(
    validateRequest(businessBranchValidator.createBusinessBranchSchema),
    businessBranchController.createBusinessBranch,
  )
  .get(businessBranchController.getPaginatedBusinessBranchs);
businessBranchRouter
  .route("/:id")
  .get(businessBranchController.getBusinessBranchById)
  .patch(
    validateRequest(businessBranchValidator.updateBusinessBranchSchema),
    businessBranchController.updateBusinessBranch,
  )
  .delete(businessBranchController.deleteBusinessBranch);
businessBranchRouter
  .route("/:id/animal-classes")
  .post(
    validateRequest(businessBranchValidator.addAnimalClassToBranchSchema),
    businessBranchController.addAnimalClassToBranch,
  );
businessBranchRouter
  .route("/:id/animal-classes/:animalClassId")
  .delete(businessBranchController.removeAnimalClassFromBranch)
  .patch(
    validateRequest(businessBranchValidator.updateAnimalClassInBranchSchema),
    businessBranchController.updateAnimalClassInBranch,
  );

businessBranchRouter
  .route("/:id/departments")
  .post(
    validateRequest(
      businessBranchValidator.addDepartmentInBusinessBranchSchema,
    ),
    businessBranchController.addDepartmentsToBranch,
  );
businessBranchRouter
  .route("/:id/departments/:departmentId")
  .delete(businessBranchController.removeDepartmentFromBranch)
  .patch(
    validateRequest(businessBranchValidator.updateDepartmentInBranchSchema),
    businessBranchController.updateDepartmentInBranch,
  );

businessBranchRouter
  .route("/:id/services")
  .post(
    validateRequest(businessBranchValidator.addServicesInBusinessBranchSchema),
    businessBranchController.addServicesToBranch,
  );
businessBranchRouter
  .route("/:id/services/:serviceId")
  .delete(businessBranchController.removeServiceFromBranch)
  .patch(
    validateRequest(businessBranchValidator.updateServiceInBranchSchema),
    businessBranchController.updateServiceInBranch,
  );

businessBranchRouter
  .route("/:id/appointment-slots")
  .post(
    validateRequest(
      businessBranchValidator.addAppointmentSlotsInBusinessBranchSchema,
    ),
    businessBranchController.addAppointmentSlotsToBranch,
  );
businessBranchRouter
  .route("/:id/appointment-slots/:appointmentSlotId")
  .patch(
    validateRequest(
      businessBranchValidator.updateAppointmentSlotInBranchSchema,
    ),
    businessBranchController.updateAppointmentSlotInBranch,
  );

export default businessBranchRouter;
