import serviceCargo from '../service/service.cargo.js';

async function Listar(req, res){
    const cd_cargo = req.params.cd_cargo;
    const serv = await serviceCargo.Listar(cd_cargo);
    res.status(200).json(serv);
}

async function Inserir(req, res) {
    const { ds_cargo } = req.body;
    try {
        const cargo = await serviceCargo.Inserir(ds_cargo);
        res.status(201).json(cargo);  // Retorna os dados do setor inserido
    } catch (error) {
        res.status(500).json({ message: "Erro ao inserir setor", error });
    }
}

async function Editar(req, res) {
    const cd_cargo = req.params.cd_cargo;
    const { ds_cargo} = req.body;
    
    try {
        // Chama o serviço de edição
        const cargo = await serviceCargo.Editar(cd_cargo, ds_cargo);
        res.status(200).json(cargo);  // Retorna o setor editado
    } catch (error) {
        res.status(500).json({ message: "Erro ao editar setor", error });
    }
}

async function Excluir(req, res) {
    const cd_cargo = req.params.cd_cargo;  // Pega o id_setor da URL
    try {
        const result = await serviceCargo.Excluir(cd_cargo); // Chama o serviço para excluir
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Setor não encontrado" }); // Se não encontrar o setor
        }
        res.status(200).json({ message: "Cargo excluído com sucesso" });  // Retorno de sucesso
    } catch (error) {
        console.error("Erro ao excluir cargo:", error);
        res.status(500).json({ message: "Erro ao excluir cargo" }); // Erro no servidor
    }
}


export default { Listar, Inserir, Editar, Excluir };