import repositoryNotificacao from '../repositories/repository.notificacao.js';  // Caminho correto para a pasta 'repositories'
            
// Função para listar todas as notificações
async function Listar() {
    try {
        const notificacoes = await repositoryNotificacao.Listar(); // Recupera as notificações do repositório
        // Verifica se o campo IMAGENS já é válido e processado no repositório
        notificacoes.forEach(notificacao => {
            if (notificacao.IMAGENS) {
                try {
                    // Se as imagens já vêm como uma string contendo URLs completas, podemos apenas garantir que o formato está correto.
                    // Aqui não estamos mais tentando fazer JSON.parse ou converter para URLs, já que isso deve ter sido feito no repositório
                    if (typeof notificacao.IMAGENS === 'string') {
                        // Caso as imagens venham como uma string separada por vírgulas, podemos transformá-las em um array
                        notificacao.IMAGENS = notificacao.IMAGENS.split(','); 
                    }
                } catch (error) {
                    console.error(`Erro ao processar imagens na notificação ${notificacao.CD_NOTIFICACAO}:`, error);
                    notificacao.IMAGENS = null; // Se ocorrer erro no processamento das imagens, define como null
                }
            } else {
                notificacao.IMAGENS = null; // Caso não haja imagens, define como null
            }
        });
        return notificacoes; // Retorna as notificações com as imagens já processadas corretamente
    } catch (error) {
        console.error("Erro ao listar notificações:", error);
        throw new Error('Erro ao listar notificações: ' + error.message);
    }
}     
// Função para buscar uma notificação específica pelo ID
async function BuscarPorId(cd_notificacao) {
    try {
        // Busca a notificação no repositório
        const notificacao = await repositoryNotificacao.BuscarPorId(cd_notificacao);
        // Verifica se a notificação foi encontrada
        if (notificacao) {
            // Verifica se a notificação possui o campo IMAGENS
            if (notificacao.IMAGENS) {
                try {
                    // Tenta parsear o campo IMAGENS, assumindo que seja uma string JSON
                    const imagensArray = JSON.parse(notificacao.IMAGENS);
                    // Se for um array, define o campo IMAGENS como o array de URLs
                    if (Array.isArray(imagensArray)) {
                        notificacao.IMAGENS = imagensArray;
                    } else {
                        notificacao.IMAGENS = null;
                    }
                } catch (error) {
                    console.error(`Erro ao processar imagem na notificação ${cd_notificacao}:`, error);
                    // Caso o JSON seja inválido, define IMAGENS como null
                    notificacao.IMAGENS = null;
                }
            } else {
                // Se não houver imagens, define como null
                notificacao.IMAGENS = null;
            }
        }
        return notificacao;
    } catch (error) {
        console.error("Erro ao buscar notificação:", error);
        throw new Error('Erro ao buscar notificação: ' + error.message);
    }
}
// Função para inserir uma nova notificação
async function Inserir(
    dt_notificacao,
    cd_setor_notificador,
    cd_setor_notificado,
    ds_ocorrido,
    ds_dano,
    ds_ocorrencia,
    anonimo,
    ds_notificacao,
    ds_acao,
    imagens,
    cd_usuario,
    cd_prontuario = null,  // Agora pode ser opcional
    nm_paciente = null,
    idade_paciente = null,
    ds_procedimento = null
) {
    try {
        // 🔹 Validação de campos obrigatórios
        if (!dt_notificacao || !cd_setor_notificador || !cd_setor_notificado || !ds_ocorrido || !ds_ocorrencia || !ds_notificacao || !ds_acao) {
            throw new Error("Campos obrigatórios não informados.");
        }        
        if (!cd_usuario) {
            throw new Error("Usuário não informado.");
        }
        // 🔹 Certifica que "imagens" seja uma string com nomes separados por vírgulas
        const imagensTexto = Array.isArray(imagens) ? imagens.join(',') : imagens || null;
        // 🔹 Envia os dados para o repository
        const resultado = await repositoryNotificacao.Inserir(
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
            cd_prontuario,  // Pode ser NULL se não informado
            nm_paciente,
            idade_paciente,
            ds_procedimento
        );
        return resultado;
    } catch (error) {
        console.error("Erro ao inserir notificação:", error);
        throw new Error("Erro ao inserir notificação: " + error.message);
    }
}
// Função para editar uma notificação existente
async function Editar(cd_notificacao, dt_notificacao, cd_setor_notificador, cd_setor_notificado, ds_ocorrido, ds_dano, ds_ocorrencia, anonimo, ds_notificacao, ds_acao, imagens, cd_usuario) {
    try {
        // 🔹 Certifica que "imagens" seja uma string com nomes separados por vírgulas, similar ao método Inserir
        let imagensTexto = null;
        if (Array.isArray(imagens)) {
            imagensTexto = imagens.join(',');  // Caso as imagens venham como um array
        } else if (typeof imagens === 'string') {
            imagensTexto = imagens;  // Se já for uma string, mantemos a mesma
        }
        // Chama o repository para editar os dados da notificação no banco
        const resultado = await repositoryNotificacao.Editar(
            cd_notificacao,
            dt_notificacao,
            cd_setor_notificador,
            cd_setor_notificado,
            ds_ocorrido,
            ds_dano,
            ds_ocorrencia,
            anonimo,
            ds_notificacao,
            ds_acao,
            imagensTexto, // Passando as imagens como string separada por vírgulas
            cd_usuario
        );
        return resultado;
    } catch (error) {
        console.error("Erro no serviço ao editar notificação:", error);
        throw new Error('Erro ao editar notificação: ' + error.message);
    }
}
// Função para excluir uma notificação
async function Excluir(cd_notificacao) {
    try {
        // Chama o repository para excluir a notificação do banco de dados
        const resultado = await repositoryNotificacao.Excluir(cd_notificacao);
        return resultado;
    } catch (error) {
        console.error("Erro no serviço ao excluir notificação:", error);
        throw new Error('Erro ao excluir notificação: ' + error.message);
    }
}

export default { Listar, Inserir, Editar, Excluir, BuscarPorId };