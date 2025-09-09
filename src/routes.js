import { Router } from "express";
import express from 'express';  // Adicione esta linha
import path from "path";
import { fileURLToPath } from "url";
import jwt from "./token.js";
import controller_usuario from "./controllers/controller.usuario.js";
import controller_appointments_usuario from "./controllers/controller_appointments_usuario.js";
import controllerSetor from "./controllers/controller.setor.js";
import controllerCargo from "./controllers/controller.cargo.js";
import controllerNotificacao from "./controllers/controller.notificacao.js";
import controllerPerfil from "./controllers/controller.perfil.js";
import controllerCategoria from "./controllers/controller.categoria.js";
import controllerClassificacao from "./controllers/controller.classificacao.js";

// Usando fileURLToPath para obter o __dirname no ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Rotas de usuário...
router.post("/usuario/login", controller_usuario.Login);
router.post("/usuario/register", controller_usuario.Inserir);
router.put("/editar/:cd_usuario", controller_usuario.Editar);
router.put("/editar/senha/:cd_usuario", controller_usuario.EditarSenha);

// Rota do tela inicial
router.get("/appointments", controller_appointments_usuario.ListarByUsuario);

// Setores
router.get("/setores", jwt.ValidateToken, controllerSetor.Listar);
router.get("/setores/:cd_setor", jwt.ValidateToken, controllerSetor.Listar);
router.post("/setores/add", jwt.ValidateToken, controllerSetor.Inserir);
router.put("/setores/edit/:cd_setor", jwt.ValidateToken, controllerSetor.Editar);
router.delete('/setores/:cd_setor', jwt.ValidateToken, controllerSetor.Excluir);

// Categorias
router.get("/categorias", jwt.ValidateToken, controllerCategoria.Listar);
router.get("/categorias/:cd_categoria", jwt.ValidateToken, controllerCategoria.Listar);
router.post("/categorias/add", jwt.ValidateToken, controllerCategoria.Inserir);
router.put("/categorias/edit/:cd_categoria", jwt.ValidateToken, controllerCategoria.Editar);
router.delete('/categorias/:cd_categoria', jwt.ValidateToken, controllerCategoria.Excluir);

// Classificação
router.get("/classificacoes", jwt.ValidateToken, controllerClassificacao.Listar);
router.get("/classificacoes/:cd_classificacao", jwt.ValidateToken, controllerClassificacao.Listar);
router.post("/classificacoes/add", jwt.ValidateToken, controllerClassificacao.Inserir);
router.put("/classificacoes/edit/:cd_classificacao", jwt.ValidateToken, controllerClassificacao.Editar);
router.delete('/classificacoes/:cd_classificacao', jwt.ValidateToken, controllerClassificacao.Excluir);

// Cargo
router.get("/cargo", controllerCargo.Listar);
router.post("/cargo/add", controllerCargo.Inserir);
router.put("/cargo/:cd_cargo", controllerCargo.Editar);
router.delete('/cargo/:cd_cargo', controllerCargo.Excluir);

// Notificação
router.get("/notificacao", jwt.ValidateToken, controllerNotificacao.Listar);
router.get("/notificacao/:cd_notificacao", jwt.ValidateToken,controllerNotificacao.Listar);
router.post("/notificacao/add", jwt.ValidateToken, controllerNotificacao.Inserir);
router.put("/notificacao/edit/:cd_notificacao", jwt.ValidateToken, controllerNotificacao.Editar);
router.delete('/notificacao/:cd_notificacao', jwt.ValidateToken, controllerNotificacao.Excluir);

// Rota para servir as imagens
router.use("/notificacao/uploads/imagens", express.static(path.join(__dirname, 'uploads', 'imagens')));

// Perfil
router.get("/perfil/", jwt.ValidateToken,controllerPerfil.Listar);
router.get("/perfil/:cd_usuario", jwt.ValidateToken,controllerPerfil.Listar);



export default router;
