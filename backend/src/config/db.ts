import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.DB_HOST || '',
    port: parseInt(process.env.DB_PORT || '30267'),
    database: process.env.DB_NAME || 'Ponto8WebApp',
    user: process.env.DB_USER || 'postgres',
    password:process.env.DB_PASSWORD || '',
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});


pool.on('connect', () => {
    console.log('conectado ao banco de dados');
})

pool.on('error', (err) =>{
    console.log(err);
})

export default pool;