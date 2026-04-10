import * as cd from "../repositories/clientData";

export const listClient = async () => {
    // const data que vai chamar a função de encontrar os players
    const data = await cd.findClients();
    // se: tiver retorna os usuarios
    // senão: retorna nada + noContent
}