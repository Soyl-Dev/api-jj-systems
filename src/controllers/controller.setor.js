import serviceSetor from '../service/service.setor.js';

async function Listar(req, res) {
    try {
        const cd_setor = req.params.cd_setor; // Captura o ID da URL (se existir)
        const serv = await serviceSetor.Listar(cd_setor); // Busca todos ou por ID
        
        if (cd_setor && !serv) {
            return res.status(404).json({ message: "Setor não encontrado" });
        }

        res.status(200).json(serv);
    } catch (error) {
        console.error("Erro ao listar setores:", error);
        res.status(500).json({ message: "Erro ao buscar setores" });
    }
}

async function Inserir(req, res) {
    try {
        const { nm_setor, ativo } = req.body;

        // Validação para verificar se o nome do setor foi fornecido
        if (!nm_setor || nm_setor.trim() === "") {
            return res.status(400).json({ message: "O campo descrição do setor é obrigatório." });
        }

        const setor = await serviceSetor.Inserir(nm_setor.trim(), ativo);
        res.status(201).json(setor);
    } catch (error) {
        if (error.message === "Já existe um setor com esse nome.") {
            return res.status(400).json({ message: error.message });
        }
        console.error("Erro no controller ao inserir setor:", error);
        res.status(500).json({ message: "Erro ao inserir setor", error });
    }
}

async function Editar(req, res) {
    const cd_setor = req.params.cd_setor;
    const { nm_setor, ativo } = req.body;

    try {
        // Validação para garantir que o nome do setor não esteja vazio
        if (!nm_setor || nm_setor.trim() === "") {
            return res.status(400).json({ message: "O campo descrição do setor é obrigatório." });
        }

        // Chama o serviço de edição
        const setor = await serviceSetor.Editar(cd_setor, nm_setor.trim(), ativo);
        res.status(200).json(setor);  // Retorna o setor editado
    } catch (error) {
        console.error("Erro no controller ao editar setor:", error);
        res.status(500).json({ message: "Erro ao editar setor", error });
    }
}


async function Excluir(req, res) {
    const cd_setor = req.params.cd_setor;  // Pega o id_setor da URL
    try {
        const result = await serviceSetor.Excluir(cd_setor); // Chama o serviço para excluir
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Setor não encontrado" }); // Se não encontrar o setor
        }
        res.status(200).json({ message: "Setor excluído com sucesso" });  // Retorno de sucesso
    } catch (error) {
        console.error("Erro ao excluir setor:", error);
        res.status(500).json({ message: "Erro ao excluir setor" }); // Erro no servidor
    }
}
export default { Listar, Inserir, Editar, Excluir };