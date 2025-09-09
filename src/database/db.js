import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Carregar as variáveis de ambiente do arquivo .env
dotenv.config();

// Criação do pool de conexões
const promisePool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_CONECTION,
    waitForConnections: true,  // Espera por conexões disponíveis
    connectionLimit: 20,       // Limita o número de conexões simultâneas
    queueLimit: 0              // Sem limite para enfileirar conexões
});

// Exporta o pool de conexões
export default promisePool;
