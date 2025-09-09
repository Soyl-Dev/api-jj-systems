const envioService = require('../services/service.envio');

const Inserir = async (req, res) => {
    const { cd_notificacao, cd_usuario, nsp } = req.body;

    if (!cd_notificacao || !cd_usuario || !nsp) {
        return res.status(400).json({ message: 'Campos cd_notificacao, cd_usuario e nsp são obrigatórios.' });
    }

    try {
        const result = await envioService.inserirResposta(cd_notificacao, cd_usuario, nsp);
        res.status(200).json({ message: 'Resposta inserida com sucesso!', data: result });
    } catch (error) {
        console.error('Erro ao inserir resposta:', error);
        res.status(500).json({ message: 'Erro ao inserir resposta.' });
    }
};


export default { Inserir };
