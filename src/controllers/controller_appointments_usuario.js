import serviceAppointmentUsuario from "../service/service_appointment_usuario.js";

async function ListarByUsuario(req, res){

    const CD_USUARIO = req.cd_usuario;
    const appointments = await serviceAppointmentUsuario(CD_USUARIO, "", "", "");
    res.status(200).json(appointments);
}


export default { ListarByUsuario };
