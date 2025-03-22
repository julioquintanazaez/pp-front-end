import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import moment from "moment";
import Swal from 'sweetalert2';

const EstudianteAsignacion = ( props ) => {
	
	const { token, user } = useContext(Context);
	const { messages, setMessages } = useContext(Context);
	const { handleLogout } = useContext(Context);
	const [estudiante, setEstudiante] = useState({});	
	const [tarea, setTarea] = useState({});	
	const [concertacion, setConcertacion] = useState({});	
	
	const formatDate = (date) => {		
        return date.toISOString().split('T')[0]
    };		

	useEffect(()=> {
        fetchEstudianteAsignacion();
    }, [messages]);	
	
	const fetchEstudianteAsignacion = async () => {
		await axios({
			method: 'get',
			url: '/tarea/leer_tarea_estudiante/',
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setEstudiante(response.data.estudiante);
				setTarea(response.data.tarea);
				setConcertacion(response.data.concertacion);
				console.log(estudiante)
				console.log("La tarea se leyó correctamente para el estudiante desde la base de datos");
			}
			else{
				console.log({"Error en response ":response.data});	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			Swal.fire("Problemas para leer la tarea del estudiante desde la base de datos", "", "error");
			handleLogout();
		});			  
	}

	return (
		<>	
			{estudiante != null ? (
				<>
				<div className="estudiante-info">
					<h2> Mi información </h2>
					<h4> {user.nombre + " " + user.primer_appellido + " " + user.segundo_appellido}</h4>
					<p1>Becado: {estudiante.est_becado == true ? "SI" : "NO"}</p1><br/>
					<p1>Trabajo: {estudiante.est_trabajo == true ? "SI" : "NO"}</p1><br/>
					<p1>Teletrabajo: {estudiante.est_trab_remoto == true ? "SI" : "NO"}</p1><br/>
				</div><br/>
				<div className="estudiante-tarea">
					<h2> Mi tarea </h2>
					<p1>Tema: {tarea.tarea_descripcion}</p1><br/>
					<p1>Tipo de actividad: {tarea.tarea_tipo}</p1><br/>
					<p1>Complejidad de la actividad: {tarea.tarea_complejidad_estimada}</p1><br/>
					<p1>Inicio: {tarea.tarea_fecha_inicio}</p1><br/>
					<p1>Fin: {tarea.tarea_fecha_fin}</p1><br/>
				</div>
				<br/>
				<div className="estudiante-concertacion">
					<h2> Mi concertación </h2>
					<p1>Tema: {concertacion.conc_tema}</p1><br/>
					<p1>Descripción: {concertacion.conc_descripcion}</p1><br/>
					<p1>Complejidad: {concertacion.conc_complejidad}</p1><br/>
					<p1>Evaluación: {concertacion.conc_evaluacion}</p1><br/>
				</div>
				</>
				) : (
				<div className="estudiante-panel">
					<span className="badge bg-danger">  No existen datos para mostrar </span>
				</div>
				)
			}
		</>
	);
}

export default EstudianteAsignacion;

