import promisePool from '../database/db.js'; // Configuração da conexão com o banco de dados

const Inserir = (cd_usuario, nsp) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO RESPOSTA (CD_USUARIO, NSP)
            VALUES (?, ?);
        `;
        db.query(query, [cd_usuario, nsp], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result); // O insertId do MySQL será usado para vincular à NOTIFICACAO
        });
    });
};

const AtualizaNotificacao = (cd_notificacao, cd_resposta) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE NOTIFICACAO
            SET CD_RESPOSTA = ?
            WHERE CD_NOTIFICACAO = ?;
        `;
        db.query(query, [cd_resposta, cd_notificacao], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
};

export default { Inserir , AtualizaNotificacao}
