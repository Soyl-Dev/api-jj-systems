import jwt from "jsonwebtoken";

//essa msg do secretToken não pode ser divulgada vai ser usada para criar nossa hash 
// codificada para altenticar o token
const secretToken = "Brasil";

function CreateToken(cd_usuario) {
    // Aqui estamos passando o cd_usuario no payload, mas o secretToken é apenas uma chave para assinar o token
    const token = jwt.sign({ cd_usuario }, secretToken, {
        expiresIn: '1d'  // Defina o tempo de expiração em formato mais legível, por exemplo, '1d' (1 dia)
    });
    return token;
}

function ValidateToken(req, res, next){
    const authToken = req.headers.authorization; // "Bearer 000000000"
    if(!authToken)
        return res.status(401).json({ error: "Token não informado" });
    const [bearer, token] = authToken.split(" "); // "Bearer" "000000000"

    jwt.verify(token, secretToken, (err, tokenDecoded) => {
        if(err)
            return res.status(401).json({   error: "Token inválido"    });        
        req.cd_usuario = tokenDecoded.cd_usuario; 
        next();
    });
}

export default { CreateToken, ValidateToken }