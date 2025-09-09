import bcrypt from "bcrypt";
import jwt from "../token.js";
import repository_usuario from "../repositories/repository.usuario.js";

async function Inserir(cd_usuario, nm_usuario, tp_privilegio, cd_senha, ds_email, contato, ramal, cd_setor) {
    try {
        // Gerar o hash da senha
        const hashCdSenha = await bcrypt.hash(cd_senha, 10);
        
        // Inserir o usuário no banco
        const resultado = await repository_usuario.Inserir(cd_usuario, nm_usuario, tp_privilegio, hashCdSenha, ds_email, contato, ramal, cd_setor);
        
        if (resultado.status === 409 || resultado.status === 500) {
            return resultado; // Retorna status de erro para o controller
        }
        
        // Gerar o token utilizando o cd_usuario
        const token = jwt.CreateToken(cd_usuario);
        
        // Retornar o usuário com o token
        return { ...resultado, token };
    } catch (error) {
        console.error("Erro no service:", error.message);
        return { status: 500, mensagem: "Erro ao processar o cadastro do usuário" };
    }
}

async function Login(CD_USUARIO, cd_senha) {
    try {
        // Busca o usuário no repositório
        const usuario = await repository_usuario.ListarByUsuario(CD_USUARIO);        
        const usuarioEncontrado = usuario; // Agora não estamos mais usando [0]
        // Verifique se o usuário foi encontrado
        if (!usuarioEncontrado) {
            console.error("Usuário não encontrado:", CD_USUARIO);
            return { status: 404, message: "Usuário não encontrado" };
        }
        // Verifica se o usuário está ativo
        if (usuarioEncontrado.SN_ATIVO === 'N') {
            console.error("Usuário está inativo:", CD_USUARIO);
            return { status: 403, message: "Usuário está inativo, acesso negado" };
        }
        // Verifica se a senha fornecida é válida
        if (!cd_senha) {
            console.error("A senha fornecida está vazia ou indefinida");
            return { status: 400, message: "Senha inválida" };
        }
        if (!usuarioEncontrado.CD_SENHA) {
            console.error("Senha não encontrada no banco de dados para o usuário:", CD_USUARIO);
            return { status: 500, message: "Erro na recuperação da senha do usuário" };
        }
        // Compara a senha fornecida com a armazenada no banco
        const senhaValida = await bcrypt.compare(cd_senha, usuarioEncontrado.CD_SENHA);

        if (senhaValida) {
            console.log("Usuario autenticado!");
            delete usuarioEncontrado.CD_SENHA; // Remove o hash antes de retornar
            usuarioEncontrado.token = jwt.CreateToken(usuarioEncontrado.CD_USUARIO);
            return usuarioEncontrado;
        } else {
            console.log("As senhas não coincidem!");
            return { status: 401, message: "Usuário ou senha inválida" };
        }

    } catch (error) {
        console.error("Erro ao realizar o login:", error); // Logando o erro completo
        return { status: 500, message: "Erro ao processar o login" };
    }
}

const Editar = async (cd_usuario, nm_usuario, tp_privilegio, cd_senha, sn_ativo, ds_email, contato, ramal, cd_setor) => {
    try {
        let hashCdSenha = null;
        if (cd_senha) {
            hashCdSenha = await bcrypt.hash(cd_senha, 10); // Gerando o hash da senha
        }

        // Chama o repositório para fazer a atualização no banco de dados
        const resultado = await repository_usuario.Editar(
            cd_usuario, nm_usuario, tp_privilegio, hashCdSenha, sn_ativo, ds_email, contato, ramal, cd_setor
        );

        return resultado;
    } catch (error) {
        console.error("Erro no serviço ao editar usuário:", error.message);
        throw new Error("Erro ao editar usuário no serviço");
    }
};

// Função para editar apenas a senha
const EditarSenha = async (cd_usuario, cd_senha) => {
    try {
        if (!cd_senha) {
            return { status: 400, message: "Senha não fornecida" };
        }

        const hashCdSenha = await bcrypt.hash(cd_senha, 10); // Gerando o hash da nova senha

        const resultado = await repository_usuario.EditarSenha(cd_usuario, hashCdSenha);

        if (resultado.status === 404) {
            return { status: 404, message: "Usuário não encontrado" };
        }

        return { status: 200, message: "Senha alterada com sucesso" };
    } catch (error) {
        console.error("Erro ao editar senha:", error.message);
        return { status: 500, message: "Erro ao alterar a senha" };
    }
};

export default { Inserir, Login, Editar, EditarSenha };
