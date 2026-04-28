import { Router } from "express";
import * as clientController from "./controllers/clientController";
import * as partController from "./controllers/partsController";
import * as vehicleController from "./controllers/vehicleController";
import * as userController from './controllers/usersControllers';
import { authToken } from './middlewares/auth';


const router = Router();

// users route
router.post('/register', userController.register);
router.post('/login', userController.login);


// client route
router.get('/clients', authToken, clientController.getClient); // lista de clientes
router.get('/clients/:name', authToken, clientController.getClientByName); // filtra clientes pelo nome -> ainda não funciona
router.post('/clients/post', authToken, clientController.postClient); // cadastro de clientes
router.patch('/clients/update/:id', authToken, clientController.updateClient); // atualizar clientes
router.delete('/clients/:id', authToken, clientController.deleteClient);

// parts route
router.get('/parts', authToken, partController.getPart);
router.get('/parts/:name', authToken, partController.getPartByName);
router.post('/parts/post', authToken, partController.postPart);
router.patch('/parts/update/:id', authToken, partController.updatePart);
router.delete('/parts/:id', authToken, partController.deletePart);

// vehicle route
router.get('/vehicle', authToken, vehicleController.getVehicle);
router.get('/vehicle/:id', authToken, vehicleController.getVehicleById);
router.post('/vehicle/post', authToken, vehicleController.postVehicle);
router.patch('/vehicle/update/:id', authToken, vehicleController.updateVehicle);
router.delete('/vehicle/:id', authToken, vehicleController.deleteVehicle);

export default router;