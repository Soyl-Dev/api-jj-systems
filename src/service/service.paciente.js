import { buscarAtendimentos } from '../repositories/repository.paciente.js';

const getAtendimentos = async (cd_atendimento) => {
    try {
        // Chama a função buscarAtendimentos passando o cd_atendimento
        const atendimentos = await buscarAtendimentos(cd_atendimento);
        
        // Verifica se há atendimentos, caso contrário retorna um array vazio
        if (!atendimentos || atendimentos.length === 0) {
            console.log(`Nenhum atendimento encontrado para o código: ${cd_atendimento}`);
            return [];
        }

        return atendimentos;
    } catch (error) {
        // Log do erro e retorno de mensagem genérica
        console.error("Erro no serviço de atendimentos:", error);
        throw new Error("Erro ao buscar os atendimentos.");
    }
};

export { getAtendimentos };
