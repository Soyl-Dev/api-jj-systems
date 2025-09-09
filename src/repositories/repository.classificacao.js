import promisePool from '../database/db.js'; // Configuração da conexão com o banco de dados

async function Listar(cd_classificacao = null) {
    try {
        let sql;
        let params = [];

        if (cd_classificacao) {
            sql = `SELECT
                    cl.CD_CLASSIFICACAO,
                    cl.NM_CLASSIFICACAO,
                    ca.NM_CATEGORIA
                    FROM CLASSIFICACAO cl
                    join categoria ca on (ca.CD_CATEGORIA = cl.CD_CATEGORIA)
                    WHERE cl.CD_CLASSIFICACAO = ?`;
            params = [cd_classificacao];
        } else {
            sql = `SELECT
                    cl.CD_CLASSIFICACAO,
                    cl.NM_CLASSIFICACAO,
                    ca.NM_CATEGORIA
                    FROM CLASSIFICACAO cl
                    join categoria ca on (ca.CD_CATEGORIA = cl.CD_CATEGORIA)
                    ORDER BY NM_CLASSIFICACAO`;
        }

        const [classificacoes] = await promisePool.query(sql, params); // Executa a consulta SQL
        
        return cd_classificacao ? classificacoes[0] : classificacoes; // Retorna um objeto único se for busca por ID
    } catch (error) {
        console.error("Erro ao listar classificações:", error);
        throw error; // Lança o erro para ser tratado pelo serviço
    }
}
async function Inserir(nm_classificacao, cd_categoria) {
    try {
        // Verifica se já existe uma classificação com o mesmo nome
        const checkSql = "SELECT 1 FROM CLASSIFICACAO WHERE nm_classificacao = ? LIMIT 1";
        const [existing] = await promisePool.query(checkSql, [nm_classificacao]);
        
        if (existing.length > 0) {
            throw new Error("Já existe uma classificação com esse nome.");
        }

        // Insere a nova classificação no banco de dados
        const sql = "INSERT INTO CLASSIFICACAO (nm_classificacao, cd_categoria) VALUES (?, ?)";
        const [result] = await promisePool.query(sql, [nm_classificacao, cd_categoria]);

        // Retorna o ID inserido
        return { id: result.insertId, nm_classificacao, cd_categoria };

    } catch (error) {
        console.error("Erro ao inserir classificação:", error);
        throw error;  // Lança o erro para ser tratado no serviço
    }
}


async function Editar(cd_classificacao, nm_classificacao, cd_categoria) {
    try {
        const sql = "UPDATE CLASSIFICACAO SET nm_classificacao = ?, cd_categoria = ? WHERE cd_classificacao = ?";
        const [result] = await promisePool.query(sql, [nm_classificacao, cd_categoria, cd_classificacao]);
        return result;  // Retorna o resultado da atualização
    } catch (error) {
        console.error("Erro ao editar classificação:", error);
        throw error;  // Lança o erro para ser tratado no serviço
    }
}

async function Excluir(cd_classificacao) {
    try {
        const sql = "DELETE FROM CLASSIFICACAO WHERE cd_classificacao = ?";
        const [result] = await promisePool.query(sql, [cd_classificacao]);
        return result;
    } catch (error) {
        console.error("Erro ao excluir classificação:", error);
        throw error;
    }
} 

export default { Listar, Inserir, Editar, Excluir };
