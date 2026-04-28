import { Router } from "express";
import * as clientController from "./controllers/clientController";
import * as partController from "./controllers/partsController";
import * as vehicleController from "./controllers/vehicleController";
import * as userController from './controllers/usersControllers';


const router = Router();

// users route
router.post('/register', userController.register);
router.post('/login', userController.login);


// client route
router.get('/clients', clientController.getClient); // lista de clientes
router.get('/clients/:name', clientController.getClientByName); // filtra clientes pelo nome -> ainda não funciona
router.post('/clients/post', clientController.postClient); // cadastro de clientes
router.patch('/clients/update/:id', clientController.updateClient); // atualizar clientes
router.delete('/clients/:id', clientController.deleteClient);

// parts route
router.get('/parts', partController.getPart);
router.get('/parts/:name', partController.getPartByName);
router.post('/parts/post', partController.postPart);
router.patch('/parts/update/:id', partController.updatePart);
router.delete('/parts/:id', partController.deletePart);

// vehicle route
router.get('/vehicle', vehicleController.getVehicle);
router.get('/vehicle/:id', vehicleController.getVehicleById);
router.post('/vehicle/post', vehicleController.postVehicle);
router.patch('/vehicle/update/:id', vehicleController.updateVehicle);
router.delete('/vehicle/:id', vehicleController.deleteVehicle);

export default router;