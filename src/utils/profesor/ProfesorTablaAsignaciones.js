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

import ConcertacionModificarModal from './../concertacion/ConcertacionModificarModal.js';
import ConcertacionEvaluarModal from './../concertacion/ConcertacionEvaluarModal.js';
import AsignacionEvaluarModal from './../asignacion/AsignacionEvaluarModal.js';
import ActividadesTablaModal from './../actividades/ActividadesTablaModal.js';
import ActividadesProfesorCrearActividadModal from './../actividades/ActividadesProfesorCrearActividadModal.js';
import AsignacionDetalleModal from './../asignacion/AsignacionDetalleModal.js';

const ProfesorTablaAsignaciones = ( props ) => {
	
	const { token } = useContext(Context);
	const { messages, setMessages } = useContext(Context);
	const { handleLogout } = useContext(Context);
	const [profesorasignaciones, setProfesorAsignaciones] = useState([]);	
	
	useEffect(()=> {
        fetchProfesorAsignciones(props.usuario.email);
    }, [messages]);	
	
	const fetchProfesorAsignciones = async (email) => {
		await axios({
			method: 'get',
			url: '/leer_profesor_asgignaciones/' + email,
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
				<tr className="row-md" key={asignacion.id_asignacion}>
					<th scope="row">{index + 1}</th>					
					<td>{asignacion.conc_tema}</td>
					<td>{asignacion.conc_complejidad}</td>	
					<td>{asignacion.tarea_tipo_nombre}</td>
					<td>{asignacion.est_nombre + " " + asignacion.est_primer_appellido + " " + asignacion.est_segundo_appellido}</td>
					<td>{asignacion.cli_nombre + " " + asignacion.cli_primer_appellido + " " + asignacion.cli_segundo_appellido}</td>
					<td>{asignacion.asg_participantes}</td>					
					<td>{asignacion.asg_evaluacion}</td>
					<td>{moment(asignacion.asg_fecha_inicio).format("MMM Do YY")}</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< AsignacionDetalleModal asignacion={asignacion} />
								</div>
							</div>								
						</div>							
					</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ActividadesProfesorCrearActividadModal asignacion={asignacion} />
								</div>
							</div>								
						</div>							
					</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ActividadesTablaModal email={asignacion.est_email} />
								</div>
							</div>								
						</div>							
					</td>
					<td>
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									<  AsignacionEvaluarModal asignacion={asignacion}/>
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
						<th>Tema</th>	
						<th>Compljidad</th>										
						<th>Tarea</th>	
						<th>Estudiante</th>	
						<th>Cliente</th>	
						<th>Apoyo</th>							
						<th>Evaluacion</th>
						<th>Fecha</th>
						<th>Detalles</th>
						<th>Tarea(+)</th>
						<th>Tareas</th>
						<th>Evaluar</th>
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

