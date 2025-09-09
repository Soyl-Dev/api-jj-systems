import { buscarAtendimentos } from '../repositories/repository.paciente.js';

const listarAtendimentos = async (req, res) => {
    const { cd_atendimento } = req.params;  // Obtém o cd_atendimento da URL

    try {
        const atendimentos = await buscarAtendimentos(cd_atendimento);  // Passa o cd_atendimento para a função
        res.status(200).json(atendimentos);  // Retorna os atendimentos encontrados
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar atendimentos", error: error.message });
    }
};

export { listarAtendimentos };
