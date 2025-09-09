import oracledb from 'oracledb';

const dbConfig = {
    user: "dbahums",
    password: "hums@lock573",
    connectString: "192.168.10.236:1521/sml",
    // Garantir que o cliente Oracle (Instant Client) seja utilizado
    externalAuth: false // Desabilita autenticação externa (caso esteja usando Oracle Instant Client com usuário e senha)
};

// Função para obter a conexão com o banco de dados Oracle
const getOracleConnection = async () => {
    let connection;
    try {
        // Verifica se o Instant Client está corretamente configurado
        await oracledb.initOracleClient({libDir: 'C:\\oracle\\instantclient'}); // O caminho para o Instant Client
        connection = await oracledb.getConnection(dbConfig);
        console.log("Conectado ao banco de dados Oracle com sucesso!");
        return connection;
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados Oracle:", error);
        throw error;
    }
};

export { getOracleConnection };
