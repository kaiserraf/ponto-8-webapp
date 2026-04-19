import { Router } from "express";
import * as clientController from "./controllers/clientController";

const router = Router();

router.get('/clients', clientController.getClient); // lista de clientes
router.get('/clients/:name', clientController.getClientByName); // filtra clientes pelo nome -> ainda não funciona

router.post('/clients/post', clientController.postClient); // cadastro de clientes

// router.patch('/clients/update/:id', clientController.updateClient); // atualizar clientes

router.delete('/clients/:id', clientController.deleteClient);

export default router;