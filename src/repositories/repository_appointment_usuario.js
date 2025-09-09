import { query } from "../database/sqlite.js";

export async function Listar(id_usuario, dt_inicial, dt_final) {
    let filtro = [];
    let sql = `SELECT
                n.dt_criacao,
                n.hr_criacao,
                n.protocolo,
                n.classificacao,
                n.setor,
                n.descricao,
                n.status_protocolo,
                n.acao,
                n.id_usuario
                FROM notificacao n
                WHERE n.protocolo > 0`; 
				
    if (id_usuario) {
        filtro.push(id_usuario);
        sql += " AND n.id_usuario = ? ";
    }
    if (dt_inicial) {
        filtro.push(dt_inicial);
        sql += " AND n.dt_criacao >= ? ";
    }
    if (dt_final) {
        filtro.push(dt_final);
        sql += " AND n.dt_criacao <= ? ";
    }
				
    sql += " ORDER BY n.dt_criacao, n.hr_criacao";
   
    const appointments = await query(sql, filtro);
    return appointments;
}
