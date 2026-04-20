import { Router } from "express";
import * as clientController from "./controllers/clientController";
import * as partController from "./controllers/partsController";


const router = Router();

router.get('/clients', clientController.getClient); // lista de clientes
router.get('/clients/:name', clientController.getClientByName); // filtra clientes pelo nome -> ainda não funciona

router.post('/clients/post', clientController.postClient); // cadastro de clientes

router.patch('/clients/update/:id', clientController.updateClient); // atualizar clientes

router.delete('/clients/:id', clientController.deleteClient);

router.get('/parts', partController.getPart);
export default router;