import { fileURLToPath } from 'url';
import { dirname } from 'path';
import serviceNotificacao from '../service/service.notificacao.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Definir __dirname manualmente para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Definir o caminho da pasta uploads dentro de src
const uploadPath = path.join(__dirname, '../uploads/imagens');
// Verificar se a pasta existe, caso contrário, criar
if (!fs.existsSync(uploadPath)) {
    try {
        fs.mkdirSync(uploadPath, { recursive: true });
        console.log('Pasta "uploads/imagens" criada com sucesso!');
    } catch (error) {
        console.error('Erro ao criar pasta "uploads/imagens":', error);
    }
}
// Configuração do multer para armazenar as imagens em um diretório 'src/uploads/imagens'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath); // Usar o novo caminho da pasta de imagens
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nome único para o arquivo
    }
});
// Configuração do multer para validar imagens
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB por imagem
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];  // Tipos permitidos
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);  // Aceita o arquivo
        } else {
            cb(new Error('Tipo de arquivo não permitido'), false);  // Rejeita o arquivo
        }
    }
}).array('imagens', 2);  // Aceita até 2 imagens
// Controller para inserir notificação com imagens
const Inserir = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({
                error: "Erro no upload da imagem",
                details: err instanceof multer.MulterError ? err.message : "Erro desconhecido"
            });
        }
        try {
            const {
                dt_notificacao,
                cd_setor_notificador,
                cd_setor_notificado,
                ds_ocorrido,
                ds_dano,
                ds_ocorrencia,
                anonimo,
                ds_notificacao,
                ds_acao,
                cd_prontuario,
                nm_paciente,
                idade_paciente,
                ds_procedimento
            } = req.body;
            const cd_usuario = req.cd_usuario || req.user?.id; // Garante que o ID do usuário seja capturado corretamente
            if (!cd_usuario) {
                return res.status(401).json({ error: "Usuário não autenticado" });
            }
            // 🔹 Captura os nomes dos arquivos enviados (caso existam)
            const imagens = req.files?.map(file => file.filename) || [];
            const imagensTexto = imagens.length ? imagens.join(',') : null; // Pode ser NULL se não houver imagens
            // 🔹 Chama o service para inserir a notificação
            const notificacao = await serviceNotificacao.Inserir(
                dt_notificacao,
                cd_setor_notificador,
                cd_setor_notificado,
                ds_ocorrido,
                ds_dano,
                ds_ocorrencia,
                anonimo,
                ds_notificacao,
                ds_acao,
                imagensTexto, 
                cd_usuario,
                cd_prontuario,
                nm_paciente,
                idade_paciente,
                ds_procedimento
            );
            return res.status(201).json({
                message: "Notificação inserida com sucesso",
                notificacao
            });
        } catch (error) {
            console.error("Erro no controller ao inserir notificação:", error);
            return res.status(500).json({
                error: "Erro ao inserir notificação",
                details: error.message
            });
        }
    });
};
// Controller para editar uma notificação com imagens
const Editar = async (req, res) => {
    const cd_notificacao = req.params.cd_notificacao; // ID da notificação
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: "Erro no upload da imagem", details: err.message });
        }
        try {
            // Captura os dados da requisição
            const { dt_notificacao, cd_setor_notificador, cd_setor_notificado, ds_ocorrido, ds_dano, ds_ocorrencia, anonimo, ds_notificacao, ds_acao } = req.body;
            const cd_usuario = req.cd_usuario; // ID do usuário autenticado
            // Verifica se há arquivos e salva os novos arquivos
            let imagens = [];
            if (req.files && req.files.length > 0) {
                imagens = req.files.map(file => file.filename); // Salva os nomes dos arquivos
            }
            // Chama o service para editar a notificação
            await serviceNotificacao.Editar(
                cd_notificacao, // ID da notificação
                dt_notificacao, // Data da notificação
                cd_setor_notificador, // Setor notificador
                cd_setor_notificado, // Setor notificado
                ds_ocorrido, // Descrição do ocorrido
                ds_dano, // Descrição do dano
                ds_ocorrencia, // Descrição da ocorrencia (se necessário)
                anonimo, // Flag de anonimato
                ds_notificacao, // Descrição da notificação
                ds_acao, // Descrição da ação tomada
                imagens.join(','), // Imagens (como uma string separada por vírgula)
                cd_usuario // ID do usuário
            );
            return res.status(200).json({ message: "Notificação editada com sucesso" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erro ao editar notificação", details: error.message });
        }
    });
};
// Lista as notificações
async function Listar(req, res) {
    try {
        const { cd_notificacao } = req.params; // Captura o parâmetro da URL
        let serv;
        if (cd_notificacao) {
            // Se um ID foi fornecido, busca apenas essa notificação
            serv = await serviceNotificacao.BuscarPorId(cd_notificacao);
            if (!serv) {
                return res.status(404).json({ message: 'Notificação não encontrada' });
            }
        } else {
            // Se nenhum ID foi passado, lista todas as notificações
            serv = await serviceNotificacao.Listar();
        }
        // Garante que a resposta seja um array no caso de múltiplas notificações
        const resposta = Array.isArray(serv) ? serv : [serv];
        // Responde com os dados diretamente, sem modificar o campo IMAGENS, pois já deve vir processado
        return res.status(200).json(resposta);
    } catch (error) {
        console.error("Erro ao listar notificações:", error);
        return res.status(500).json({ message: 'Erro ao listar notificações', error: error.message });
    }
}
// Controller para excluir uma notificação
const Excluir = async (req, res) => {
    const cd_notificacao = req.params.cd_notificacao;
    try {
        // Chama o service para excluir a notificação
        const result = await serviceNotificacao.Excluir(cd_notificacao);

        if (result) {
            res.status(200).json({ message: "Notificação excluída com sucesso" });
        } else {
            res.status(404).json({ message: "Notificação não encontrada" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao excluir notificação", details: error.message });
    }
};

export default { Listar, Inserir, Editar, Excluir };