import repositoryCargo from '../repositories/repository.cargo.js';  // Caminho correto para a pasta 'repositories'

async function Listar(cd_cargo) {
    const serv = await repositoryCargo.Listar(cd_cargo);  // Chama a função ListarSetor
    return serv;
}

async function Inserir(ds_cargo) {
    try {
        // Chame o repository para inserir os dados no banco
        const resultado = await repositoryCargo.Inserir(ds_cargo);
        return resultado;  // Retorna o resultado para o controller
    } catch (error) {
        console.error("Erro no serviço ao inserir cargo:", error);
        throw error;  // Lança o erro para ser tratado no controller
    }
}

async function Editar(cd_cargo, ds_cargo) {
    try {
        // Chama a função do repositório para atualizar o setor
        const resultado = await repositoryCargo.Editar(cd_cargo, ds_cargo);
        return resultado; // Retorna o resultado da atualização para o controller
    } catch (error) {
        console.error("Erro no serviço ao editar cargo:", error);
        throw error; // Lança o erro para ser tratado no controller
    }
}

async function Excluir(cd_cargo) {
    try {
        const result = await repositoryCargo.Excluir(cd_cargo); // Chama o repositório
        return result; // Retorna o resultado da exclusão
    } catch (error) {
        console.error("Erro no serviço ao excluir setor:", error);
        throw error; // Lança o erro para ser tratado no controller
    }
}

export default { Listar, Inserir, Editar, Excluir }