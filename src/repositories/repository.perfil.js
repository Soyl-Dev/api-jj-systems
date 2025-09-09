import promisePool from '../database/db.js'; // Configuração da conexão com o banco de dados

async function Listar(cd_usuario) {
    let sql = `SELECT
                u.CD_USUARIO,
                u.NM_USUARIO,
                CASE
                    WHEN u.TP_PRIVILEGIO = 'A' THEN 'Administrador'
                    WHEN u.TP_PRIVILEGIO = 'U' THEN 'Usuário'
                    WHEN u.TP_PRIVILEGIO = 'C' THEN 'Coordenador'
                    ELSE 'Não especificado'
                END AS TP_PRIVILEGIO,
                u.SN_ATIVO,
                u.DS_EMAIL,
                u.CONTATO,
                u.RAMAL,
                u.CD_SETOR,
                s.NM_SETOR
                FROM USUARIOS u
                JOIN SETOR s ON (s.CD_SETOR = u.CD_SETOR)`;

    // Adiciona a cláusula WHERE apenas se o parâmetro cd_usuario for passado
    const params = [];
    if (cd_usuario) {
        sql += ` WHERE u.CD_USUARIO = ?`;
        params.push(cd_usuario);
    }

    // Executa a consulta e retorna apenas os dados necessários
    const [rows] = await promisePool.query(sql, params);
    return rows; // 'rows' contém os dados com o campo TP_PRIVILEGIO modificado
}

export default { Listar };
