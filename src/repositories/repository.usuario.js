import promisePool from '../database/db.js';

const Inserir = async (
    cd_usuario,
    nm_usuario,
    tp_privilegio,
    cd_senha, // Senha já criptografada
    ds_email,
    contato,
    ramal,
    cd_setor
) => {
    try {
        // Verifica se o usuário já existe
        const checkSql = `SELECT 1 FROM USUARIOS WHERE CD_USUARIO = ? LIMIT 1`;
        const [usuarioExistente] = await promisePool.execute(checkSql, [cd_usuario]);

        if (usuarioExistente.length > 0) {
            return { status: 409, mensagem: "Usuário já existe" };
        }

        // Insere o novo usuário
        const insertSql = `
            INSERT INTO USUARIOS (
                CD_USUARIO, NM_USUARIO, TP_PRIVILEGIO, CD_SENHA, DS_EMAIL, CONTATO, RAMAL, CD_SETOR
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await promisePool.execute(insertSql, [
            cd_usuario,
            nm_usuario,
            tp_privilegio,
            cd_senha,
            ds_email,
            contato,
            ramal,
            cd_setor
        ]);

        // Retorna o usuário recém-inserido
        return { status: 201, mensagem: "Usuário cadastrado com sucesso!" };
    } catch (error) {
        console.error("Erro ao inserir usuário:", error.message);
        return { status: 500, mensagem: "Erro ao inserir usuário no banco de dados" };
    }
};

const ListarByUsuario = async (cd_usuario) => {
    try {
        const sql = "SELECT * FROM USUARIOS WHERE CD_USUARIO = ? LIMIT 1";
        const [usuario] = await promisePool.execute(sql, [cd_usuario]);

        if (usuario.length === 0) {
            return { status: 404, mensagem: "Usuário não encontrado" };
        }
        return usuario[0]; // Retorna o primeiro usuário encontrado
    } catch (error) {
        console.error("Erro ao listar usuário:", error.message);
        return { status: 500, mensagem: "Erro ao buscar usuário no banco de dados" };
    }
};

const Editar = async (cd_usuario, nm_usuario, tp_privilegio, hashCdSenha, sn_ativo, ds_email, contato, ramal, cd_setor) => {
    try {
        // Verifica se os parâmetros de entrada não são undefined e define como null caso sejam
        nm_usuario = nm_usuario ?? null;
        tp_privilegio = tp_privilegio ?? null;
        sn_ativo = sn_ativo ?? null;
        ds_email = ds_email ?? null;
        contato = contato ?? null;
        ramal = ramal ?? null;
        hashCdSenha = hashCdSenha ?? null;
        cd_setor = cd_setor ?? null;

        // A consulta SQL de atualização de dados do usuário
        let updateSql = `
            UPDATE USUARIOS SET 
                NM_USUARIO = ?, 
                TP_PRIVILEGIO = ?, 
                SN_ATIVO = ?, 
                DS_EMAIL = ?, 
                CONTATO = ?, 
                RAMAL = ?,
                CD_SETOR = ?
        `;

        const parametros = [nm_usuario, tp_privilegio, sn_ativo, ds_email, contato, ramal, cd_setor];

        // Se a senha for fornecida, adiciona à consulta
        if (hashCdSenha) {
            updateSql += ", CD_SENHA = ?";
            parametros.push(hashCdSenha);
        }

        updateSql += " WHERE CD_USUARIO = ?";
        parametros.push(cd_usuario);

        // Executa a consulta de atualização
        const [result] = await promisePool.execute(updateSql, parametros);

        // Verifica se alguma linha foi afetada
        if (result.affectedRows === 0) {
            return { status: 404, mensagem: "Usuário não encontrado para atualização" };
        }

        // Retorna sucesso
        return { status: 200, mensagem: "Usuário atualizado com sucesso!" };
    } catch (error) {
        console.error("Erro ao atualizar usuário no repositório:", error.message);
        return { status: 500, mensagem: "Erro ao atualizar usuário no banco de dados" };
    }
};

// Função para editar a senha do usuário
const EditarSenha = async (cd_usuario, cd_senha) => {
    try {
        const query = `
            UPDATE usuarios 
            SET CD_SENHA = ? 
            WHERE CD_USUARIO = ?
        `;
        const params = [cd_senha, cd_usuario];
        
        // Utiliza await para executar a query com o pool de conexões
        const [result] = await promisePool.execute(query, params);

        if (result.affectedRows === 0) {
            return { status: 404, message: "Usuário não encontrado" };
        }

        return { status: 200, message: "Senha alterada com sucesso!" };
    } catch (error) {
        console.error("Erro ao atualizar a senha no banco:", error.message);
        return { status: 500, message: "Erro ao atualizar a senha no banco de dados" };
    }
};



export default { Inserir, ListarByUsuario, Editar, EditarSenha };
