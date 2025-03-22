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

import AsignacionModificarModal from './../asignacion/AsignacionModificarModal.js';
import AsignacionEvaluarModal from './../asignacion/AsignacionEvaluarModal.js';
import AsignacionPrediccionModal from '../asignacion/AsignacionPrediccionModal.js';

const ProfesorTablaAsignaciones = ( props ) => {
	
	const { token } = useContext(Context);
	const { messages, setMessages } = useContext(Context);
	const { handleLogout } = useContext(Context);
	const [profesorasignaciones, setProfesorAsignaciones] = useState([]);	
	
	useEffect(()=> {
        fetchProfesorAsignciones();
    }, [messages]);	
	
	const fetchProfesorAsignciones = async () => {
		await axios({
			method: 'get',
			url: '/tarea/leer_tareas_profesor/',
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setProfesorAsignaciones(response.data);			
				console.log("Se leyeron correctamente las aignaciones para el profesor desde la base de datos");
			}
			else{
				console.log({"Error en response ":response.data});	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			Swal.fire("Problemas para leer asignaciones desde la base de datos", "", "error");
			handleLogout();
		});			  
	}
	
	const renderTableData = () => {
		return profesorasignaciones?.map((asignacion, index) => (
				<tr className="row-md" key={asignacion.id_tarea}>
					<th scope="row">{index + 1}</th>					
					<td>{asignacion.tarea_tipo}</td>
					<td>{asignacion.tarea_descripcion}</td>	
					<td>{asignacion.tarea_activa == true ? "SI" : "NO"}</td>
					<td>{asignacion.est_nombre +" "+ asignacion.est_primer_appellido +" "+asignacion.est_segundo_appellido}</td>
					<td>{asignacion.conc_tema}</td>
					<td>{asignacion.tarea_complejidad_estimada}</td>
					<td>{asignacion.tarea_participantes}</td>	
					<td>{asignacion.tarea_evaluacion}</td>
					<td>{moment(asignacion.tarea_fecha_inicio).format("MMM Do YY")}</td>
					<td>{moment(asignacion.tarea_fecha_fin).format("MMM Do YY")}</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< AsignacionModificarModal asignacion={asignacion} />
								</div>
							</div>								
						</div>							
					</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< AsignacionEvaluarModal asignacion={asignacion} />
								</div>
							</div>								
						</div>							
					</td>
					<td>
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< AsignacionPrediccionModal asignacion={asignacion} />
								</div>
							</div>								
						</div>
					</td>
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
						<th>Modificar</th>
						<th>Evaluar</th>
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

export default ProfesorTablaAsignaciones;

