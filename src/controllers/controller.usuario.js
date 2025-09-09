import service_usuario from "../service/service.usuario.js";

async function Inserir(req, res) {
    try {
        const { cd_usuario, nm_usuario, tp_privilegio, cd_senha, ds_email, contato, ramal, cd_setor } = req.body;
        
        const usuario = await service_usuario.Inserir(cd_usuario, nm_usuario, tp_privilegio, cd_senha, ds_email, contato, ramal, cd_setor);
        
        // Verifica se o usuário já existe
        if (usuario.status === 409) {
            return res.status(409).json({ mensagem: "Usuário já existe!" });
        }

        // Verifica erro interno no serviço
        if (usuario.status === 500) {
            return res.status(500).json({ mensagem: usuario.mensagem });
        }

        // Se tudo estiver correto, retorna o usuário com status 201
        return res.status(201).json(usuario);
    } catch (error) {
        console.error("Erro no controller:", error.message);
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
}

async function Login(req, res) {
    const { cd_usuario, cd_senha } = req.body;

    try {
        // Chama o serviço de login para buscar os dados do usuário
        const usuario = await service_usuario.Login(cd_usuario, cd_senha);

        // Se o usuário não for encontrado
        if (usuario.length === 0) {
            return res.status(401).json({ error: "Usuário ou senha inválida" });
        }
        // Se o usuário passou nas validações, retorna o usuário com o token (se necessário)
        return res.status(200).json({
            CD_USUARIO: usuario.CD_USUARIO,
            NM_USUARIO: usuario.NM_USUARIO,
            TP_PRIVILEGIO: usuario.TP_PRIVILEGIO,
            token: usuario.token, // Supondo que o token seja gerado na função de login no service
        });

    } catch (error) {
        console.error("Erro no controller:", error.message);
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
}

// Função para editar usuário
async function Editar(req, res) {
    try {
        const { cd_usuario } = req.params; // Pegamos o nome de login da URL
        const { nm_usuario, tp_privilegio, cd_senha, sn_ativo, ds_email, contato, ramal, cd_setor } = req.body;

        // Chama o serviço para atualizar os dados
        const usuarioAtualizado = await service_usuario.Editar(cd_usuario, nm_usuario, tp_privilegio, cd_senha, sn_ativo, ds_email, contato, ramal, cd_setor);
        
        if (usuarioAtualizado.status === 404) {
            return res.status(404).json({ mensagem: "Usuário não encontrado!" });
        }

        if (usuarioAtualizado.status === 500) {
            return res.status(500).json({ mensagem: usuarioAtualizado.mensagem });
        }

        return res.status(200).json({ mensagem: "Usuário atualizado com sucesso!" });

    } catch (error) {
        console.error("Erro no controller ao editar usuário:", error.message);
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
}

// Função para editar senha
async function EditarSenha(req, res) {
    try {
        const { cd_usuario } = req.params; // Pegamos o nome de login da URL
        const { cd_senha } = req.body; // Nova senha fornecida pelo usuário

        // Chama o serviço para atualizar a senha
        const usuarioAtualizado = await service_usuario.EditarSenha(cd_usuario, cd_senha);

        if (usuarioAtualizado.status === 404) {
            return res.status(404).json({ mensagem: "Usuário não encontrado!" });
        }

        if (usuarioAtualizado.status === 500) {
            return res.status(500).json({ mensagem: usuarioAtualizado.mensagem });
        }

        return res.status(200).json({ mensagem: "Senha atualizada com sucesso!" });

    } catch (error) {
        console.error("Erro no controller ao editar senha:", error.message);
        return res.status(500).json({ mensagem: "Erro interno no servidor" });
    }
}

export default { Inserir, Login, Editar, EditarSenha };
