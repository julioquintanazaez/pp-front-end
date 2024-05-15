import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import moment from "moment";
import Swal from 'sweetalert2';
import { Table } from 'react-bootstrap';

import AsignacionEliminar from './../asignacion/AsignacionEliminar.js';
import AsignacionModificarModal from './../asignacion/AsignacionModificarModal.js';
import AsignacionEvaluarModal from './../asignacion/AsignacionEvaluarModal.js';
import AsignacionModificarTipoTareaModal from './../asignacion/AsignacionModificarTipoTareaModal.js';
import AsignacionModificarActoresModal from './../asignacion/AsignacionModificarActoresModal.js';
import AsignacionActivar from './../asignacion/AsignacionActivar.js';
//
//

const AsignacionTabla = (props) => {
	
	const { token, user } = useContext(Context);
	const { messages, setMessages } = useContext(Context);
	const { handleLogout } = useContext(Context);
	const [asignaciones, setAsignaciones] = useState([]);	
	
	useEffect(()=> {
        fetchAsignaciones();
    }, [messages]);	
	
	const fetchAsignaciones = async () => {
		await axios({
			method: 'get',
			url: '/leer_asgignaciones_tareas/',
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setAsignaciones(response.data);			
				console.log("Se leyeron correctamente los asignaciones desde la base de datos");
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
		return asignaciones?.map((asignacion, index) => (
				<tr className="row-md" key={asignacion.id_asignacion}>
					<th scope="row">{index + 1}</th>					
					<td>{asignacion.asg_descripcion}</td>
					<td>{asignacion.asg_complejidad_estimada}</td>	
					<td>{asignacion.tarea_tipo_nombre}</td>
					<td>{asignacion.conc_tema}</td>
					<td>{asignacion.est_nombre} {asignacion.est_primer_appellido}</td>
					<td>{asignacion.prf_nombre} {asignacion.prf_primer_appellido}</td>
					<td>{asignacion.cli_nombre} {asignacion.cli_primer_appellido}</td>
					<td>{asignacion.asg_participantes}</td>
					<td>{asignacion.asg_fecha_inicio != null ? asignacion.asg_fecha_inicio.split('T')[0] : asignacion.asg_fecha_inicio}</td>					
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									Detalles
								</div>
							</div>								
						</div>							
					</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< AsignacionActivar asignacion={asignacion} />
								</div>
							</div>								
						</div>							
					</td>
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
									< AsignacionEliminar asignacion={asignacion} />
								</div>
							</div>	
						</div>							
					</td>		
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< AsignacionModificarTipoTareaModal asignacion={asignacion} />
								</div>
							</div>	
						</div>							
					</td>		
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< AsignacionModificarActoresModal asignacion={asignacion} />
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
				</tr>
			));
		}

	return (
		<>			
			<Table className="table" striped bordered hover size="sm" responsive>
				<thead className="table-dark">
					<tr>
						<th scope="col">#</th>	
						<th scope="col">Descripción</th>	
						<th scope="col">Compljidad</th>	
						<th scope="col">Tipo de Tarea</th>	
						<th scope="col">Concertación</th>
						<th scope="col">Estudiante</th>
						<th scope="col">Profesor</th>	
						<th scope="col">Cliente</th>	
						<th scope="col">Participantes</th>	
						<th scope="col">Fecha de Inicio</th>
						<th scope="col">Detalles</th>
						<th scope="col">Estado</th>
						<th scope="col">Modificar</th>
						<th scope="col">Eliminar</th>
						<th scope="col">Tipo</th>
						<th scope="col">Actores</th>
						<th scope="col">Evaluar</th>
					</tr>
				</thead>
				<tbody className="table-group-divider">						
					{renderTableData()}
				</tbody>
			</Table>
		</>
	);
}

export default AsignacionTabla;

