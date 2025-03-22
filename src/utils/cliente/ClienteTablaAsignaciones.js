import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import moment from "moment";
import Swal from 'sweetalert2';
import { Table } from 'react-bootstrap';
import { BiLike } from 'react-icons/bi';
import { BiBox } from 'react-icons/bi';   //< BiBox />

import AsignacionDetalleModal from '../asignacion/AsignacionPrediccionModal.js';

const ClienteTablaAsignaciones = ( props ) => {
	
	const { token } = useContext(Context);
	const { messages, setMessages } = useContext(Context);
	const { handleLogout } = useContext(Context);
	const [clienteasignaciones, setClienteAsignaciones] = useState([]);	
	
	useEffect(()=> {
        fetchClienteAsignciones();
    }, [messages]);	
	
	const fetchClienteAsignciones = async () => {
		await axios({
			method: 'get',
			url: '/tarea/leer_tareas_cliente/',
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setClienteAsignaciones(response.data);			
				console.log("Se leyeron correctamente las tareas para el cliente desde la base de datos");
			}
			else{
				console.log({"Error en response ":response.data});	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			Swal.fire("Problemas para leer tareas desde la base de datos", "", "error");
			handleLogout();
		});			  
	}
	
	const renderTableData = () => {
		return clienteasignaciones?.map((asignacion, index) => (
				<tr className="row-md" key={asignacion.id_tarea}>
					<th scope="row">{index + 1}</th>					
					<td>{asignacion.tarea_tipo}</td>
					<td>{asignacion.tarea_descripcion}</td>	
					<td>{asignacion.tarea_activa == true ? "SI" : "NO"}</td>
					<td>{asignacion.est_nombre +" "+ asignacion.est_primer_appellido +" "+ asignacion.est_segund_appellido}</td>
					<td>{asignacion.conc_tema}</td>
					<td>{asignacion.tarea_complejidad_estimada}</td>
					<td>{asignacion.tarea_participantes}</td>	
					<td>{asignacion.tarea_evaluacion}</td>
					<td>{moment(asignacion.tarea_fecha_inicio).format("MMM Do YY")}</td>
					<td>{moment(asignacion.tarea_fecha_fin).format("MMM Do YY")}</td>
					<td>{asignacion.tarea_evaluacion_pred == null ? (
						<span className="bg-danger">Sin Predicción</span>
					) : (
						<span className="bg-success">{asignacion.tarea_evaluacion_pred}</span>
					)}</td>				
				</tr>
			));
		}

	return (
		<>			
			<Table className="table" striped bordered hover size="sm" responsive>
				<thead className="table-dark">
					<tr>
						<th scope="col">#</th>	
						<th>Tipo</th>	
						<th>Descripción</th>	
						<th>Estado</th>	
						<th>Estudiante</th>	
						<th>Concertación</th>	
						<th>Complajidad</th>							
						<th>Participantes</th>
						<th>Evaluación</th>
						<th>Inicio</th>
						<th>Fin</th>
						<th>Predición</th>
					</tr>
				</thead>
				<tbody className="table-group-divider">						
					{renderTableData()}
				</tbody>
			</Table>
		</>
	);
	
}

export default ClienteTablaAsignaciones;

