import serviceUser from "../service/service.user.js";

async function Inserir(req, res){

    const {name, email, password} = req.body;
    const user = await serviceUser.Inserir(name, email, password);
    res.status(201).json(user);
}

async function Login(req, res){

    const {email, password} = req.body;
    const user = await serviceUser.Login(email, password);
    if(user.length == 0)
        res.status(401).json({error: "E-mail ou senha inválida"});
    else
        res.status(200).json(user);
}    

async function Profile(req, res){ 

    const id_user = req.id_user;
    const user = await serviceUser.Profile(id_user);
    res.status(200).json(user);
} 

async function InserirAdmin(req, res){

    const {name, email, password} = req.body;
    const user = await serviceUser.InserirAdmin(name, email, password);
    res.status(201).json(user);
}

async function LoginAdmin(req, res){

    const {email, password} = req.body;
    const user = await serviceUser.LoginAdmin(email, password);
    if(user.length == 0)
        res.status(401).json({error: "E-mail ou senha inválida"});
    else
        res.status(200).json(user);
}   
//para cadastra novo usuario
async function InserirAdmin2(req, res){

    const {login, name, email, password, permission, is_active} = req.body;
    const user = await serviceUser.InserirAdmin2(login, name, email, password, permission, is_active);
    res.status(201).json(user);
}

async function LoginAdmin2(req, res){

    const {login, password} = req.body;
    const user = await serviceUser.LoginAdmin2(login, password);
    if(user.length == 0)
        res.status(401).json({error: "E-mail ou senha inválida"});
    else
        res.status(200).json(user);
}  

export default {  Inserir, Login, Profile, InserirAdmin, LoginAdmin, InserirAdmin2, LoginAdmin2 }