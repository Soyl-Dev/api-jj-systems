import promisePool from '../database/db.js'; // Configuração da conexão com o banco de dados

async function Listar(cd_setor = null) {
    try {
        let sql;
        let params = [];

        if (cd_setor) {
            sql = "SELECT * FROM SETOR WHERE CD_SETOR = ?";
            params = [cd_setor];
        } else {
            sql = "SELECT * FROM SETOR ORDER BY NM_SETOR";
        }

        const [setores] = await promisePool.query(sql, params); // Executa a consulta SQL
        
        return cd_setor ? setores[0] : setores; // Retorna um objeto único se for busca por ID
    } catch (error) {
        console.error("Erro ao listar setores:", error);
        throw error; // Lança o erro para ser tratado pelo serviço
    }
}

async function Inserir(nm_setor, ativo) {
    try {
        // Verifica se já existe um setor com o mesmo nome
        const checkSql = "SELECT * FROM SETOR WHERE nm_setor = ?";
        const [existing] = await promisePool.query(checkSql, [nm_setor]);

        if (existing.length > 0) {
            throw new Error("Já existe um setor com esse nome.");
        }

        // Inserindo os dados corretamente (incluindo `ativo`)
        const sql = "INSERT INTO SETOR (nm_setor, ativo) VALUES (?, ?)";
        const [result] = await promisePool.query(sql, [nm_setor, ativo]);

        return { id: result.insertId, nm_setor, ativo };
    } catch (error) {
        console.error("Erro ao inserir setor:", error);
        throw error;
    }
}


async function Editar(cd_setor, nm_setor, ativo) {
    try {
        const sql = "UPDATE SETOR SET nm_setor = ?, ativo = ? WHERE cd_setor = ?";
        const [result] = await promisePool.query(sql, [nm_setor, ativo, cd_setor]);
        return result;  // Retorna o resultado da atualização
    } catch (error) {
        console.error("Erro ao editar setor:", error);
        throw error;  // Lança o erro para ser tratado no serviço
    }
}

async function Excluir(cd_setor) {
    try {
        const sql = "DELETE FROM SETOR WHERE cd_setor = ?";
        const [result] = await promisePool.query(sql, [cd_setor]);
        return result;
    } catch (error) {
        console.error("Erro ao excluir setor:", error);
        throw error;
    }
}

export default { Listar, Inserir, Editar, Excluir };
