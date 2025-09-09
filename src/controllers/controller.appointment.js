import serviceAppointment from "../service/service.appointment.js";

async function ListarByUser(req, res){

    const id_user = req.id_user;
    const appointments = await serviceAppointment.Listar(id_user, "", "", "");
    res.status(200).json(appointments);
}

async function Inserir(req, res){

    const id_user = req.id_user;
    const { id_doctor, id_service, booking_date, booking_hour } = req.body;
    const appointments = await serviceAppointment.Inserir( id_user, id_doctor, id_service, booking_date, booking_hour );
    res.status(201).json(appointments);
}

async function Excluir(req, res){

    const id_user = req.id_user;
	const id_appointment = req.params.id_appointment;
    const appointments = await serviceAppointment.Excluir( id_user, id_appointment );
    res.status(200).json(appointments);
}



async function Listar(req, res){

    const dt_start = req.query.dt_start;
	const dt_end = req.query.dt_end;
	const id_doctor = req.query.id_doctor;
	
    const appointments = await serviceAppointment.Listar(0, dt_start, dt_end, id_doctor);
    res.status(200).json(appointments);
}

export default { ListarByUser, Inserir, Excluir, Listar };