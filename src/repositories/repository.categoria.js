import promisePool from '../database/db.js'; // Configuração da conexão com o banco de dados

async function Listar(cd_categoria = null) {
    try {
        let sql;
        let params = [];

        if (cd_categoria) {
            sql = "SELECT * FROM CATEGORIA WHERE CD_CATEGORIA = ?";
            params = [cd_categoria];
        } else {
            sql = "SELECT * FROM CATEGORIA ORDER BY NM_CATEGORIA";
        }

        const [categorias] = await promisePool.query(sql, params); // Executa a consulta SQL
        
        return cd_categoria ? categorias[0] : categorias; // Retorna um objeto único se for busca por ID
    } catch (error) {
        console.error("Erro ao listar setores:", error);
        throw error; // Lança o erro para ser tratado pelo serviço
    }
}

async function Inserir(nm_categoria, ativo) {
    try {
        // Verifica se já existe uma categoria com o mesmo nome
        const checkSql = "SELECT * FROM CATEGORIA WHERE nm_categoria = ?";
        const [existing] = await promisePool.query(checkSql, [nm_categoria]);
        if(existing.length > 0){
            throw new Error("Já existe uma categoria com esse nome.");
        }
        const sql = "INSERT INTO CATEGORIA (nm_categoria) VALUES (?)";
        const [result] = await promisePool.query(sql, [nm_categoria, ativo]);
        return result;  // Retorna o resultado da inserção
    } catch (error) {
        console.error("Erro ao inserir categoria:", error);
        throw error;  // Lança o erro para ser tratado no serviço
    }
}

async function Editar(cd_categoria, nm_categoria, ativo) {
    try {
        const sql = "UPDATE CATEGORIA SET nm_categoria = ?, ativo = ? WHERE cd_categoria = ?";
        const [result] = await promisePool.query(sql, [nm_categoria, ativo, cd_categoria]);
        return result;  // Retorna o resultado da atualização
    } catch (error) {
        console.error("Erro ao editar categoria:", error);
        throw error;  // Lança o erro para ser tratado no serviço
    }
}

async function Excluir(cd_categoria) {
    try {
        const sql = "DELETE FROM CATEGORIA WHERE cd_categoria = ?";
        const [result] = await promisePool.query(sql, [cd_categoria]);
        return result;
    } catch (error) {
        console.error("Erro ao excluir categoria:", error);
        throw error;
    }
} 

export default { Listar, Inserir, Editar, Excluir };
