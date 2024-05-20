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
	const [estudianteasignacion, setEstudianteAsignacion] = useState({});	
	
	useEffect(()=> {
        fetchEstudianteAsignacion(props.usuario.email);
    }, [messages]);	
	
	const fetchEstudianteAsignacion = async (email) => {
		await axios({
			method: 'get',
			url: '/leer_asgignacion_estudiante/' + email,
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setEstudianteAsignacion(response.data);
				console.log("Leida la asignación correctamente para el estudiante desde la base de datos");
			}
			else{
				console.log({"Error en response ":response.data});	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			Swal.fire("Problemas para leer la asignacion del estudiante desde la base de datos", "", "error");
			handleLogout();
		});			  
	}

	return (
		<>	
			{estudianteasignacion != null ? (
				<div className="estudiante-panel">
					<h1> Cosas del estudiante </h1>
					<h4> {estudianteasignacion.est_nombre + " " + estudianteasignacion.est_primer_appellido + " " + estudianteasignacion.est_segundo_appellido}</h4>
					<br/>
					<h5>Asignación</h5>
					<p1>Tema: {estudianteasignacion.asg_descripcion}</p1>
					<br/>
					<p1>Tipo de actividad: {estudianteasignacion.tarea_tipo_nombre}</p1>
					<br/>
					<p1>Complejidad de la actividad: {estudianteasignacion.asg_complejidad_estimada}</p1>
					<br/>
					<br/>
					<h4>Tutor</h4>
					<p1>{estudianteasignacion.prf_nombre + " " + estudianteasignacion.prf_primer_appellido + " " + estudianteasignacion.prf_segundo_appellido}</p1>		
					<br/>	
					<br/>
					<h4>Assesor de empresa</h4>
					<p1>{estudianteasignacion.cli_nombre + " " + estudianteasignacion.cli_primer_appellido + " " + estudianteasignacion.cli_segundo_appellido}</p1>
				</div>
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

