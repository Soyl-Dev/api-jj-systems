import oracledb from 'oracledb';
import { getOracleConnection } from '../database/mv.js';

// Função para formatar a data no formato 'YYYY-MM-DD'
const formatarData = (data) => {
    const dataObj = new Date(data); // Converte a data para um objeto Date
    if (isNaN(dataObj)) {
        return null; // Se a data não for válida, retorna null
    }
    return dataObj.toISOString().split('T')[0]; // Formata como 'YYYY-MM-DD'
};

// Função para calcular a idade com base na data de nascimento
const calcularIdade = (dataNascimento) => {
    const nascimento = new Date(dataNascimento); // Converte a data no formato ISO 8601 para Date
    const hoje = new Date();  // Data atual
    let idade = hoje.getFullYear() - nascimento.getFullYear();  // Diferença de anos
    const mes = hoje.getMonth(); // Mês atual
    const dia = hoje.getDate(); // Dia atual

    // Ajusta a idade se o aniversário ainda não tiver ocorrido este ano
    if (mes < nascimento.getMonth() || (mes === nascimento.getMonth() && dia < nascimento.getDate())) {
        idade--; // Subtrai 1 se ainda não fez aniversário
    }
    return idade;
};

const buscarAtendimentos = async (cd_atendimento) => {
    let connection;
    try {
        connection = await getOracleConnection();
        const result = await connection.execute(
            ` SELECT
                a.cd_atendimento,
                p.nm_paciente,
                p.dt_nascimento,
                c.nm_convenio,
                a.dt_atendimento,
                CASE
                    WHEN a.tp_atendimento = 'U' THEN 'Urgência/emergência'
                    WHEN a.tp_atendimento = 'I' THEN 'Internação'
                    WHEN a.tp_atendimento = 'E' THEN 'Externo'
                    WHEN a.tp_atendimento = 'A' THEN 'Externo'
                END AS tipo_atendimento,
                pf.ds_pro_fat,
                l.ds_leito,
                ta.ds_tip_acom
                FROM atendime a
                JOIN paciente p ON p.CD_PACIENTE = a.CD_PACIENTE
                JOIN CONVENIO c ON c.cd_convenio = a.cd_convenio
                JOIN PRO_FAT pf ON pf.cd_pro_fat = a.cd_pro_int
                LEFT JOIN LEITO l ON l.cd_leito = a.cd_leito
                LEFT JOIN TIP_ACOM ta ON ta.cd_tip_acom = a.cd_tip_acom
                WHERE a.cd_atendimento = :cd_atendimento`,
            [cd_atendimento],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );

        // Verifique os dados retornados
        console.log(result);

        // Se encontrado, formatar as datas e calcular a idade do paciente
        if (result.rows && result.rows.length > 0) {
            result.rows.forEach(row => {
                console.log(row); // Verifique os dados de cada linha retornada

                // Formata as datas
                row.dt_nascimento = formatarData(row.DT_NASCIMENTO);
                row.dt_atendimento = formatarData(row.DT_ATENDIMENTO);

                // Calcula a idade se a data de nascimento for válida
                if (row.dt_nascimento) {
                    row.idade = calcularIdade(row.dt_nascimento);
                } else {
                    row.idade = null; // Caso a data de nascimento seja inválida
                }

                // Exibe o nome do paciente, data de nascimento formatada e idade calculada
                console.log(`Nome: ${row.NM_PACIENTE}, Nascimento: ${row.dt_nascimento}, Idade Calculada: ${row.idade}`);
            });
        }

        return result.rows;
    } catch (error) {
        console.error("Erro ao buscar atendimentos:", error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error("Erro ao fechar conexão:", err);
            }
        }
    }
};

export { buscarAtendimentos };
