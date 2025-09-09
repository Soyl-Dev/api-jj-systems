import repositorySetor from '../repositories/repository.setor.js';  // Caminho correto para a pasta 'repositories'

async function Listar(cd_setor = null) {
    return await repositorySetor.Listar(cd_setor);
}

async function Inserir(nm_setor, ativo) {
    try {
        return await repositorySetor.Inserir(nm_setor, ativo);
    } catch (error) {
        console.error("Erro no serviço ao inserir setor:", error);
        throw error;
    }
}


async function Editar(cd_setor, nm_setor, ativo) {
    try {
        // Chama a função do repositório para atualizar o setor
        const resultado = await repositorySetor.Editar(cd_setor, nm_setor, ativo);
        return resultado; // Retorna o resultado da atualização para o controller
    } catch (error) {
        console.error("Erro no serviço ao editar setor:", error);
        throw error; // Lança o erro para ser tratado no controller
    }
}

async function Excluir(id_setor) {
    try {
        const result = await repositorySetor.Excluir(id_setor); // Chama o repositório
        return result; // Retorna o resultado da exclusão
    } catch (error) {
        console.error("Erro no serviço ao excluir setor:", error);
        throw error; // Lança o erro para ser tratado no controller
    }
}

export default { Listar, Inserir, Editar, Excluir };
