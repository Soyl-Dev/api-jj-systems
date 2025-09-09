import repositoryAppointment from "../repositories/repository.appointment.js";

async function Listar(id_user, dt_start, dt_end, id_doctor){

    const appointments = await repositoryAppointment.Listar(id_user, dt_start, dt_end, id_doctor);       
    return appointments;   

}

async function Inserir(id_user, id_doctor, id_service, booking_date, booking_hour){

    const appointments = await repositoryAppointment.Inserir( id_user, id_doctor, id_service, booking_date, booking_hour );       
    return appointments;  

}

async function Excluir(id_user, id_appointment){

    const appointments = await repositoryAppointment.Excluir( id_user, id_appointmentr );       
    return appointments;  

}



export default { Listar, Inserir, Excluir }