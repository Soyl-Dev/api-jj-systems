import promisePool from '../database/db.js'; // Configuração da conexão com o banco de dados

async function Listar(){
    try {
        let sql = "SELECT * FROM CARGO";
        const [cargos] = await promisePool.query(sql); // Executa a consulta SQL
        return cargos; // Retorna o resultado da consulta
    } catch (error) {
        console.error("Erro ao listar cargos:", error);
        throw error; // Lança o erro para ser tratado pelo serviço
    }
}

async function Inserir(ds_cargo) {
    try {
        const sql = "INSERT INTO CARGO (ds_cargo) VALUES (?)";
        const [result] = await promisePool.query(sql, [ds_cargo]);
        return result;  // Retorna o resultado da inserção
    } catch (error) {
        console.error("Erro ao inserir cargo:", error);
        throw error;  // Lança o erro para ser tratado no serviço
    }
}

async function Editar(cd_cargo, ds_cargo) {
    try {
        const sql = "UPDATE CARGO SET ds_cargo = ? WHERE cd_cargo = ?";
        const [result] = await promisePool.query(sql, [ds_cargo, cd_cargo]);
        return result;  // Retorna o resultado da atualização
    } catch (error) {
        console.error("Erro ao editar setor:", error);
        throw error;  // Lança o erro para ser tratado no serviço
    }
}

async function Excluir(cd_cargo) {
    try {
        const sql = "DELETE FROM CARGO WHERE cd_cargo = ?";
        const [result] = await promisePool.query(sql, [cd_cargo]);
        return result;
    } catch (error) {
        console.error("Erro ao excluir cargo:", error);
        throw error;
    }
}



export default { Listar, Inserir, Editar, Excluir };
