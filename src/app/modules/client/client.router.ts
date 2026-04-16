import { Router } from "express";
import clientController from "./client.controller.js";
import validateRequest from "../../middleware/validateRequest.js";
import clientValidator from "./client.validator.js";

const clientRouter = Router();

clientRouter
  .route("/")
  .post(
    validateRequest(clientValidator.createClientSchema),
    clientController.createClient,
  )
  .get(clientController.getPaginatedClients);
clientRouter
  .route("/:id/pets")
  .post(
    validateRequest(clientValidator.addPetsToClientSchema),
    clientController.addPetsToClient,
  );
clientRouter
  .route("/:clientId/pets/:petId")
  .delete(clientController.removePetFromClient);
clientRouter
  .route("/:id")
  .get(clientController.getClientById)
  .patch(
    validateRequest(clientValidator.updateClientSchema),
    clientController.updateClient,
  )
  .delete(clientController.deleteClient);

export default clientRouter;
