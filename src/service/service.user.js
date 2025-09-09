import repositoryUser from "../repositories/repository.user.js";
import bcrypt from "bcrypt";
import jwt from "../token.js";


async function Inserir(name, email, password){
    const hashPassword = await bcrypt.hash(password, 10)
    const user = await repositoryUser.Inserir(name, email, hashPassword);       

    user.token = jwt.CreateToken(user.id_user);

    return user;   
}

async function Login(email, password){
    
    const user = await repositoryUser.ListarByEmail(email);
    
    if(user.length == 0)
        return [];
    else{
        if(await bcrypt.compare(password, user.password)){
            delete user.password;

            user.token = user.token = jwt.CreateToken(user.id_user);

            return user;
        }else
            return [];
    }       
    return user;   
}

async function Profile(id_user){
    const user = await repositoryUser.Profile(id_user);       
    return user;   
}

async function InserirAdmin(name, email, password){
    const hashPassword = await bcrypt.hash(password, 10)
    const user = await repositoryUser.InserirAdmin(name, email, hashPassword);       

    user.token = jwt.CreateToken(user.id_user);

    return user;   
}

async function LoginAdmin(email, password){
    
    const user = await repositoryUser.ListarByEmailAdmin(email);
    
    if(user.length == 0)
        return [];
    else{
        if(await bcrypt.compare(password, user.password)){
            delete user.password;

            user.token = user.token = jwt.CreateToken(user.id_user);

            return user;
        }else
            return [];
    }       
    return user;   
}

// novo teste
async function InserirAdmin2(login, name, email, password, permission, is_active){
    const hashPassword = await bcrypt.hash(password, 10)
    const user = await repositoryUser.InserirAdmin2(login, name, email, hashPassword, permission, is_active);       

    user.token = jwt.CreateToken(user.id_user);

    return user;   
}

async function LoginAdmin2(login, password){
    
    const user = await repositoryUser.ListarByEmailAdmin2(login);
    
    if(user.length == 0)
        return [];
    else{
        if(await bcrypt.compare(password, user.password)){
            delete user.password;

            user.token = user.token = jwt.CreateToken(user.id_user);

            return user;
        }else
            return [];
    }       
    return user;   
}


export default { Inserir, Login, Profile, InserirAdmin, LoginAdmin, InserirAdmin2, LoginAdmin2 }