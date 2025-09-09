import servicePerfil from '../service/service.perfil.js';

async function Listar(req, res) {
    try {
        // Obtém o cd_usuario dos parâmetros da URL
        const cd_usuario = req.params.cd_usuario || null;  // Se não houver parâmetro, será null

        // Chama o serviço para listar os dados
        const serv = await servicePerfil.Listar(cd_usuario);

        // Verifica se o serviço retornou dados
        if (!serv || (Array.isArray(serv) && serv.length === 0)) {
            return res.status(404).json({ message: 'Nenhum usuário encontrado' });
        }

        // Retorna os dados com status 200
        return res.status(200).json(serv);
    } catch (error) {
        // Em caso de erro, retorna status 500 com a mensagem do erro
        return res.status(500).json({ message: `Erro ao buscar o perfil: ${error.message}` });
    }
}

export default { Listar };
