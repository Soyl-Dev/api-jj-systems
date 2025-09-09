import promisePool from '../database/db.js'; // Configuração da conexão com o banco de dados

// Lista todas as notificações ou uma específica
async function Listar() {
    try {
        const sql = `SELECT
                    n.CD_NOTIFICACAO,
                    n.DT_NOTIFICACAO,
                    s1.NM_SETOR AS SETOR_NOTIFICADOR,
                    s2.NM_SETOR AS SETOR_NOTIFICADO,
                    n.DS_OCORRIDO,
                    n.DS_DANO,
                    n.DS_OCORRENCIA,
                    u.NM_USUARIO,
                    n.ANONIMO,
                    n.DS_NOTIFICACAO,
                    n.DS_ACAO,
                    p.CD_PRONTUARIO,
                    p.IDADE_PACIENTE,
                    p.NM_PACIENTE,
                    p.DS_PROCEDIMENTO,
                    n.IMAGENS,
                    s.DS_STATUS
                    FROM notificacao n
                    JOIN setor s1 ON s1.CD_SETOR = n.CD_SETOR_NOTIFICADOR
                    JOIN setor s2 ON s2.CD_SETOR = n.CD_SETOR_NOTIFICADO
                    JOIN usuarios u ON u.CD_USUARIO = n.CD_USUARIO
                    JOIN status s ON s.CD_STATUS = n.CD_STATUS
                    LEFT JOIN paciente p ON p.CD_PACIENTE = n.CD_PACIENTE
                ORDER BY n.DT_NOTIFICACAO DESC;`;

        const [notificacoes] = await promisePool.query(sql);

        if (!notificacoes || notificacoes.length === 0) {
            throw new Error("Nenhuma notificação encontrada.");
        }

        // Processando as imagens corretamente
        notificacoes.forEach(notificacao => {
           // console.log(`IMAGENS antes de processar:`, notificacao.IMAGENS);  // Verifica o valor de IMAGENS no banco        

            if (notificacao.IMAGENS) {
                // Verifique se as imagens são uma string separada por vírgulas
                const imagensArray = notificacao.IMAGENS.split(',').map(img => img.trim());

                // Processa a URL das imagens para o formato completo
                notificacao.IMAGENS = imagensArray.map(img => `http://localhost:3001/notificacao/uploads/imagens/${img}`);
            } else {
                notificacao.IMAGENS = null;
            }
           // console.log(`IMAGENS após processar:`, notificacao.IMAGENS);  // Verifica o valor após o processamento
        });

        return notificacoes;
    } catch (error) {
        console.error("Erro ao listar notificações:", error);
        throw error;
    }
}

// Busca uma única notificação pelo ID
async function BuscarPorId(cd_notificacao) {
    try {
        const sql = `SELECT
                    n.CD_NOTIFICACAO,
                    n.DT_NOTIFICACAO,
                    s1.NM_SETOR AS SETOR_NOTIFICADOR,
                    s2.NM_SETOR AS SETOR_NOTIFICADO,
                    n.DS_OCORRIDO,
                    n.DS_DANO,
                    n.DS_OCORRENCIA,
                    u.NM_USUARIO,
                    n.ANONIMO,
                    n.DS_NOTIFICACAO,
                    n.DS_ACAO,
                    p.CD_PRONTUARIO,
                    p.IDADE_PACIENTE,
                    p.NM_PACIENTE,
                    p.DS_PROCEDIMENTO,
                    n.IMAGENS
                    FROM notificacao n
                    JOIN setor s1 ON s1.CD_SETOR = n.CD_SETOR_NOTIFICADOR
                    JOIN setor s2 ON s2.CD_SETOR = n.CD_SETOR_NOTIFICADO
                    JOIN usuarios u ON u.CD_USUARIO = n.CD_USUARIO
                    LEFT JOIN paciente p ON p.CD_PACIENTE = n.CD_PACIENTE
                    WHERE n.CD_NOTIFICACAO = ?`;
        
        const [notificacoes] = await promisePool.query(sql, [cd_notificacao]);

        if (!notificacoes || notificacoes.length === 0) {
            throw new Error("Nenhuma notificação encontrada.");
        }

        // Processando as imagens corretamente e aplicando a regra do anonimato
        notificacoes.forEach(notificacao => {
            // Regra: Se ANONIMO for "S", remover NM_USUARIO
            if (notificacao.ANONIMO && notificacao.ANONIMO.toUpperCase() === 'S') {
                delete notificacao.NM_USUARIO;
            }

            // Processamento do campo IMAGENS
            if (notificacao.IMAGENS) {
                // Verifica se as imagens são uma string separada por vírgulas
                const imagensArray = notificacao.IMAGENS.split(',').map(img => img.trim());
                // Processa a URL das imagens para o formato completo
                notificacao.IMAGENS = imagensArray.map(img => `http://localhost:3001/notificacao/uploads/imagens/${img}`);
            } else {
                notificacao.IMAGENS = null;
            }
        });

        return notificacoes;
    } catch (error) {
        console.error("Erro ao listar notificações:", error);
        throw error;
    }
}


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
    cd_prontuario = null,   // Dados do paciente opcionais
    nm_paciente = null,
    idade_paciente = null,
    ds_procedimento = null
) {
    let connection; // Garantindo que a variável connection seja definida antes de usá-la
    try {
        if (!cd_usuario) {
            throw new Error("CD Usuário não enviado. Informe o usuário.");
        }

        // Inicia a transação com o pool de conexões
        connection = await promisePool.getConnection(); // Agora inicializando connection corretamente
        await connection.beginTransaction(); // Inicia a transação

        let cd_paciente = null; // Inicializa como null

        // Se os dados do paciente foram informados, insere na tabela PACIENTE
        if (cd_prontuario && nm_paciente && idade_paciente && ds_procedimento) {
            const sqlPaciente = `
                INSERT INTO PACIENTE (
                    cd_prontuario, 
                    nm_paciente, 
                    idade_paciente, 
                    ds_procedimento
                ) VALUES (?, ?, ?, ?)`;

            const [resultPaciente] = await connection.query(sqlPaciente, [
                cd_prontuario, 
                nm_paciente, 
                idade_paciente, 
                ds_procedimento
            ]);

            // Verifica se a inserção foi bem-sucedida
            if (resultPaciente && resultPaciente.insertId) {
                cd_paciente = resultPaciente.insertId; // Obtém o ID gerado para o paciente
            } else {
                throw new Error("Erro ao inserir dados do paciente.");
            }
        }

        // Garante que "imagens" seja uma string com nomes separados por vírgulas
        const imagensTexto = Array.isArray(imagens) ? imagens.join(',') : imagens || null;

        // SQL de inserção na tabela NOTIFICACAO
        const sql = `
            INSERT INTO NOTIFICACAO (
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
                cd_paciente
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await connection.query(sql, [
            dt_notificacao, 
            cd_setor_notificador, 
            cd_setor_notificado, 
            ds_ocorrido, 
            ds_dano,
            ds_ocorrencia,
            anonimo, 
            ds_notificacao, 
            ds_acao,
            imagensTexto, // Agora armazenando apenas os nomes dos arquivos
            cd_usuario,
            cd_paciente // Se cd_paciente for null, será tratado corretamente pelo banco
        ]);

        // Confirma a transação
        await connection.commit();
        return result;
    } catch (error) {
        // Se houver erro, faz o rollback da transação
        if (connection) {
            await connection.rollback();
        }
        console.error("Erro ao inserir notificação:", error);
        throw error;
    } finally {
        // Libera a conexão independentemente do sucesso ou erro
        if (connection) {
            connection.release();
        }
    }
}

// Função para editar a notificação
async function Editar(cd_notificacao, dt_notificacao, cd_setor_notificador, cd_setor_notificado, ds_ocorrido, ds_dano, ds_ocorrencia, anonimo, ds_notificacao, ds_acao, imagens, cd_usuario) {
    try {
        // Prepara o SQL para atualizar a notificação no banco
        const sql = `
            UPDATE NOTIFICACAO
            SET dt_notificacao = ?, 
                cd_setor_notificador = ?, 
                cd_setor_notificado = ?, 
                ds_ocorrido = ?, 
                ds_dano = ?, 
                ds_ocorrencia = ?, 
                anonimo = ?, 
                ds_notificacao = ?, 
                ds_acao = ?, 
                imagens = ?, 
                cd_usuario = ?
            WHERE CD_NOTIFICACAO = ?`;

        // Executa a query com os parâmetros passados
        const [result] = await promisePool.query(sql, [
            dt_notificacao, 
            cd_setor_notificador, 
            cd_setor_notificado, 
            ds_ocorrido, 
            ds_dano, 
            ds_ocorrencia, 
            anonimo, 
            ds_notificacao, 
            ds_acao, 
            imagens, // imagens já vem como string separada por vírgulas ou como base64
            cd_usuario, 
            cd_notificacao
        ]);

        // Retorna o resultado da query, que pode ser usado no serviço
        return result;
    } catch (error) {
        console.error("Erro ao editar notificação no repositório:", error);
        throw error; // Lança o erro para que o serviço possa tratá-lo
    }
}

// Função para excluir notificação
async function Excluir(cd_notificacao) {
    try {
        const sql = `DELETE FROM NOTIFICACAO WHERE CD_NOTIFICACAO = ?`;
        const [result] = await promisePool.query(sql, [cd_notificacao]);

        return result;
    } catch (error) {
        console.error("Erro ao excluir notificação:", error);
        throw error;
    }
}

export default { Listar, Inserir, Editar, Excluir, BuscarPorId };
