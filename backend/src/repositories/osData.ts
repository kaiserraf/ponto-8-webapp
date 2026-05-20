import pool from '../config/db';
import { LaborOsModel } from '../Models/laborOsModel';
import { OSModel } from '../Models/OSModel';
import { PartsOsModel } from '../Models/partsOsModel';

// lista todas as OS
export const listOS = async (): Promise<OSModel[]> => {
    const result = await pool.query<OSModel>(
        `SELECT id_so AS "idSo", id_client AS "idClient", id_vehicle AS "idVehicle", mechanic AS "mechanic", description AS "description", total_price AS "totalPrice", pdf_path AS "pdfPath", created_at AS "createdAt" FROM service_orders ORDER BY id_so`
    );
    return result.rows;
};

// busca uma os pelo id
export const findOSById = async (id:number): Promise<OSModel | null> => {
    const result = await pool.query<OSModel>(
        `SELECT id_so AS "idSo", id_client AS "idClient", id_vehicle AS "idVehicle", mechanic AS "mechanic", description AS "description", total_price AS "totalPrice", pdf_path AS "pdfPath", created_at AS "createdAt" FROM service_orders WHERE id_so = $1`, [id]
    );
    return result.rows[0] ?? null;
};

// criar OS no banco
export const insertOS = async (os: OSModel): Promise<OSModel> => {
    const result = await pool.query(
        `INSERT INTO service_orders(
            id_client, id_vehicle, mechanic, 
            description, total_price, created_at
            )
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id_so AS "idSo", id_client AS "idClient", id_vehicle AS "idVehicle", mechanic AS "mechanic", description AS "description", total_price AS "totalPrice", pdf_path AS "pdfPath", created_at AS "createdAt"`,
        [
            os.idClient, os.idVehicle, os.mechanic,
            os.description, os.totalPrice, os.createdAt
        ]
    );

    const o = await result.rows[0];
    if(!o) throw new Error ("Falha ao criar OS");
    return o;
};

// atualiza o pdf_path quando pdf é gerado
export const updatePath = async (pdfPath:string | undefined, id:number) => {
    const result = await pool.query<OSModel>(
        `UPDATE service_orders SET pdf_path = $1 WHERE id_so = $2
        RETURNING id_so AS "idSo", id_client AS "idClient", id_vehicle AS "idVehicle", mechanic AS "mechanic", description AS "description", total_price AS "totalPrice", pdf_path AS "pdfPath", created_at AS "createdAt"`,
        [pdfPath, id]
    );

    return result.rows[0] ?? null;
};

// atualiza toda a OS
export const updateOS = async (id: number, bodyValue:Partial<{
        idClient: number,
        idVehicle: number,
        mechanic: number,
        description: string,
        totalPrice: number
    }>
) => {
    const field: string[] = [];
    const value: unknown[] = [];
    let count = 1;

    if(bodyValue.idClient !== undefined){
        field.push(`id_client = $${count++}`);
        value.push(bodyValue.idClient);
    }
    if(bodyValue.idVehicle !== undefined){
        field.push(`id_vehicle = $${count++}`);
        value.push(bodyValue.idVehicle);
    }
    if(bodyValue.mechanic !== undefined){
        field.push(`mechanic = $${count++}`);
        value.push(bodyValue.mechanic);
    }
    if(bodyValue.description !== undefined){
        field.push(`description = $${count++}`);
        value.push(bodyValue.description);
    }
    if(bodyValue.totalPrice !== undefined){
        field.push(`total_price = $${count++}`);
        value.push(bodyValue.totalPrice);
    }

    if(field.length === 0) return null;

    value.push(id);

    const result = await pool.query<OSModel>(
        `UPDATE service_orders SET ${field.join(',')}
        WHERE id_so = $${count}
        RETURNING id_so AS "idSo", id_client AS "idClient", id_vehicle AS "idVehicle",
        mechanic AS "mechanic", description AS "description", total_price AS "totalPrice"`,
        value
    );

    return result.rows[0] ?? null;
};

// deleta a OS
export const deleteOS = async (id:number):Promise<OSModel> => {
    const result = await pool.query<OSModel>(
        `DELETE FROM service_orders
        WHERE id_so = $1
        RETURNING id_so AS "idSo", id_client AS "idClient", id_vehicle AS "idVehicle", mechanic AS "mechanic", description AS "description", total_price AS "totalPrice", pdf_path AS "pdfPath", created_at AS "createdAt"`,
        [id]
    );

    return result.rows[0] ?? null;
};

// insere as peças da os em order_parts
export const insertOP = async (parts:PartsOsModel):Promise<PartsOsModel> => {
    const result = await pool.query(
        `INSERT INTO order_parts (id_so, id_part, amount, unit_price)
        VALUES ($1, $2, $3, $4)
        RETURNING id AS "id", id_so AS "idSo", id_part AS "idPart", amount AS "amount", unit_price AS "unitPrice"`,
        [parts.idSo, parts.idPart, parts.amount, parts.unitPrice]
    );

    const op = await result.rows[0];
    if(!op) throw new Error ("Falha ao inserir peças na OS");
    return op;
};

// encontra a peça em order_parts pelo id
export const findOpByIdSo = async (id:number):Promise<PartsOsModel[]> => {
    const result = await pool.query(
        `SELECT id AS "id", id_so AS "idSo", id_part AS "idPart", amount AS "amount", unit_price AS "unitPrice" FROM order_parts WHERE id_so  = $1`, [id]
    );
    return result.rows;
};

// delete peça em order_parts
export const deleteOP = async (idSo:number, idPart:number):Promise<PartsOsModel> => {
    const result = await pool.query<PartsOsModel>(
        `DELETE FROM order_parts
        WHERE id_part = $1 AND id_so = $2
        RETURNING id AS "id", id_so AS "idSo", id_part AS "idPart", amount AS "amount", unit_price AS "unitPrice"`,
        [idPart,idSo]
    );

    return result.rows[0] ?? null;
};

// insere serviço em order_labor
export const insertOL = async (labor:LaborOsModel) => {
    const result = await pool.query(
        `INSERT INTO order_labor (id_so, id_labor, amount, unit_price)
        VALUES ($1, $2, $3, $4)
        RETURNING id AS "id", id_so AS "idSo", id_labor AS "idLabor", amount AS "amount", unit_price AS "unitPrice"`, [labor.idSo, labor.idLabor, 1, labor.value] // quantidade sempre vai ser 1
    );

    const ol = await result.rows[0];
    if(!ol) throw new Error ("Falha ao inserir serviço na OS");
    return ol;
};

// encontra serviço pelo id
export const findOlByIdSo = async (id:number) => {
    const result = await pool.query(
        `SELECT id AS "id", id_so AS "idSo", id_labor AS "idLabor", amount AS "amount", unit_price AS "unitPrice" FROM order_labor WHERE id_so  = $1`, [id]
    );
    return result.rows;
};

// delete serviços em order_labor
export const deleteOL = async (idSo:number, idLabor:number):Promise<LaborOsModel> => {
    const result = await pool.query<LaborOsModel>(
        `DELETE FROM order_labor
        WHERE id_labor = $1 AND id_so = $2
        RETURNING id AS "id", id_so AS "idSo", id_labor AS "idLabor", amount AS "amount", unit_price AS "unitPrice"`, [idLabor, idSo]
    );

    return result.rows[0] ?? null;
};