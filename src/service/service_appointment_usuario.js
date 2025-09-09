

async function Listar(cd_usuario, dt_inicial, dt_final){

    const appointments = await repositoryAppointmentUsuario.Listar(cd_usuario, dt_inicial, dt_final);       
    return appointments;   

}



export default { Listar }