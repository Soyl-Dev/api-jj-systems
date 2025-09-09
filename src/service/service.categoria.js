import repositoryCategoria from "../repositories/repository.categoria.js";


async function Listar(cd_categoria = null) {
    return await repositoryCategoria.Listar(cd_categoria);
}

async function Inserir(nm_categoria, ativo) {
    try {
        // Chame o repository para inserir os dados no banco
        const resultado = await repositoryCategoria.Inserir(nm_categoria, ativo);
        return resultado;  // Retorna o resultado para o controller
    } catch (error) {
        console.error("Erro no serviço ao inserir categoria:", error);
        throw error;  // Lança o erro para ser tratado no controller
    }
}

async function Editar(cd_categoria, nm_categoria, ativo) {
    try {
        // Chama a função do repositório para atualizar o setor
        const resultado = await repositoryCategoria.Editar(cd_categoria, nm_categoria, ativo);
        return resultado; // Retorna o resultado da atualização para o controller
    } catch (error) {
        console.error("Erro no serviço ao editar categoria:", error);
        throw error; // Lança o erro para ser tratado no controller
    }
}

async function Excluir(cd_categoria) {
    try {
        const result = await repositoryCategoria.Excluir(cd_categoria); // Chama o repositório
        return result; // Retorna o resultado da exclusão
    } catch (error) {
        console.error("Erro no serviço ao excluir categoria:", error);
        throw error; // Lança o erro para ser tratado no controller
    }
} 

export default { Listar, Inserir, Editar, Excluir };
