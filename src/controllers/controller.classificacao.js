import serviceClassificacao from "../service/service.classificacao.js";


async function Listar(req, res) {
    try {
        const cd_classificacao = req.params.cd_classificacao; // Captura o ID da URL (se existir)
        const serv = await serviceClassificacao.Listar(cd_classificacao); // Busca todos ou por ID
        
        if (cd_classificacao && !serv) {
            return res.status(404).json({ message: "Categoria não encontrado" });
        }

        res.status(200).json(serv);
    } catch (error) {
        console.error("Erro ao listar classificações:", error);
        res.status(500).json({ message: "Erro ao buscar classificações" });
    }
}

async function Inserir(req, res) {
    const { nm_classificacao, cd_categoria } = req.body;
    
    if (!nm_classificacao || nm_classificacao.trim() === "") {
        return res.status(400).json({ message: "O campo descrição da classificação é obrigatório." });
    }

    try {
        const classificacao = await serviceClassificacao.Inserir(nm_classificacao, cd_categoria);
        res.status(201).json(classificacao);  // Retorna os dados da classificação inserida
    } catch (error) {
        if (error.message === "Já existe uma classificação com esse nome.") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Erro ao inserir classificação", error });
    }
}

async function Editar(req, res) {
    const cd_classificacao = req.params.cd_classificacao;
    const { nm_classificacao, cd_categoria } = req.body;
    
    if (!nm_classificacao || nm_classificacao.trim() === "") {
        return res.status(400).json({ message: "O campo descrição da classificação é obrigatório." });
    }

    try {
        // Chama o serviço de edição
        const classificacao = await serviceClassificacao.Editar(cd_classificacao, nm_classificacao, cd_categoria);
        res.status(200).json(classificacao);  // Retorna a classificação editada
    } catch (error) {
        res.status(500).json({ message: "Erro ao editar classificação", error });
    }
}

async function Excluir(req, res) {
    const cd_classificacao = req.params.cd_classificacao;  // Pega o id_setor da URL
    try {
        const result = await serviceClassificacao.Excluir(cd_classificacao); // Chama o serviço para excluir
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Classificação não encontrado" }); // Se não encontrar o setor
        }
        res.status(200).json({ message: "Classificação excluído com sucesso" });  // Retorno de sucesso
    } catch (error) {
        console.error("Erro ao excluir classificação:", error);
        res.status(500).json({ message: "Erro ao excluir classificação" }); // Erro no servidor
    }
} 
export default { Listar, Inserir, Editar, Excluir };