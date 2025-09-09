import repositoryPerfil from '../repositories/repository.perfil.js';  // Caminho correto para a pasta 'repositories'

async function Listar(cd_usuario) {
    try {
        // Chama a função Listar no repositório para buscar os dados do perfil
        const serv = await repositoryPerfil.Listar(cd_usuario);

        // Verifica se nenhum usuário foi encontrado, caso contrário retorna a lista de usuários
        if (!serv || (Array.isArray(serv) && serv.length === 0)) {
            throw new Error('Nenhum usuário encontrado');
        }

        return serv;
    } catch (error) {
        // Em caso de erro, lança uma exceção com a mensagem de erro
        throw new Error(`Erro ao buscar o perfil: ${error.message}`);
    }
}

export default { Listar };
