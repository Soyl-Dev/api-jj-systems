import serviceCategoria from "../service/service.categoria.js";


async function Listar(req, res) {
    try {
        const cd_categoria = req.params.cd_categoria; // Captura o ID da URL (se existir)
        const serv = await serviceCategoria.Listar(cd_categoria); // Busca todos ou por ID
        
        if (cd_categoria && !serv) {
            return res.status(404).json({ message: "Categoria não encontrado" });
        }

        res.status(200).json(serv);
    } catch (error) {
        console.error("Erro ao listar categorias:", error);
        res.status(500).json({ message: "Erro ao buscar categorias" });
    }
}

async function Inserir(req, res) {
    const { nm_categoria, ativo } = req.body;
    
    try {
        // Validação para garantir que o nome da categoria não esteja vazio
        if (!nm_categoria || nm_categoria.trim() === "") {
            return res.status(400).json({ message: "O campo descrição da categoria é obrigatório." });
        }

        const categoria = await serviceCategoria.Inserir(nm_categoria.trim(), ativo);
        res.status(201).json(categoria);  // Retorna os dados da categoria inserida
    } catch (error) {
        if (error.message === "Já existe uma categoria com esse nome.") {
            return res.status(400).json({ message: error.message });
        }
        res.status(500).json({ message: "Erro ao inserir categoria", error });
    }
}

async function Editar(req, res) {
    const cd_categoria = req.params.cd_categoria;
    const { nm_categoria, ativo } = req.body;

    try {
        // Validação para garantir que o nome da categoria não esteja vazio
        if (!nm_categoria || nm_categoria.trim() === "") {
            return res.status(400).json({ message: "O campo descrição da categoria é obrigatório." });
        }

        const categoria = await serviceCategoria.Editar(cd_categoria, nm_categoria.trim(), ativo);
        res.status(200).json(categoria);  // Retorna a categoria editada
    } catch (error) {
        res.status(500).json({ message: "Erro ao editar categoria", error });
    }
}

async function Excluir(req, res) {
    const cd_categoria = req.params.cd_categoria;  // Pega o id_setor da URL
    try {
        const result = await serviceCategoria.Excluir(cd_categoria); // Chama o serviço para excluir
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Categoria não encontrado" }); // Se não encontrar o setor
        }
        res.status(200).json({ message: "Categoria excluído com sucesso" });  // Retorno de sucesso
    } catch (error) {
        console.error("Erro ao excluir setor:", error);
        res.status(500).json({ message: "Erro ao excluir setor" }); // Erro no servidor
    }
} 
export default { Listar, Inserir, Editar, Excluir };