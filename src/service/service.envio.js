import repositoryEnvio from "../repositories/repository.envio.js";

const Inserir = async (cd_notificacao, cd_usuario, nsp) => {
    try {
        // Inserir na tabela RESPOSTA
        const resposta = await repository.Inser(cd_usuario, nsp);

        // Atualizar a tabela NOTIFICACAO com o CD_RESPOSTA
        const resultado = await repositoryEnvio.atualizarNotificacao(cd_notificacao, resposta.insertId);

        return resultado;
    } catch (error) {
        console.error('Erro na lógica de inserção de resposta:', error);
        throw new Error('Erro ao processar inserção de resposta.');
    }
};

export default { Inserir };

