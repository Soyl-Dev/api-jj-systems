import repositoryClassificacao from "../repositories/repository.classificacao.js";


async function Listar(cd_classificacao = null) {
    return await repositoryClassificacao.Listar(cd_classificacao);
}

async function Inserir(nm_classificacao, cd_categoria) {
    try {
        // Chame o repository para inserir os dados no banco
        const resultado = await repositoryClassificacao.Inserir(nm_classificacao, cd_categoria);
        return resultado;  // Retorna o resultado para o controller
    } catch (error) {
        console.error("Erro no serviço ao inserir classificacao:", error);
        throw error;  // Lança o erro para ser tratado no controller
    }
}

async function Editar(cd_classificacao, nm_classificacao, cd_categoria) {
    try {
        // Chama a função do repositório para atualizar o setor
        const resultado = await repositoryClassificacao.Editar(cd_classificacao, nm_classificacao, cd_categoria);
        return resultado; // Retorna o resultado da atualização para o controller
    } catch (error) {
        console.error("Erro no serviço ao editar classificação:", error);
        throw error; // Lança o erro para ser tratado no controller
    }
}

async function Excluir(cd_classificacao) {
    try {
        const result = await repositoryClassificacao.Excluir(cd_classificacao); // Chama o repositório
        return result; // Retorna o resultado da exclusão
    } catch (error) {
        console.error("Erro no serviço ao excluir classificação:", error);
        throw error; // Lança o erro para ser tratado no controller
    }
} 

export default { Listar, Inserir, Editar, Excluir};
