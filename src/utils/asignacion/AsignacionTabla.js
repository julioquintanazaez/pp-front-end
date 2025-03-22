import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from '../../context/Context.js';
import axios from 'axios';
import moment from "moment";
import Swal from 'sweetalert2';
import { Table } from 'react-bootstrap';

import AsignacionEliminar from './AsignacionEliminar.js';
import AsignacionModificarModal from './AsignacionModificarModal.js';
import AsignacionEvaluarModal from './AsignacionEvaluarModal.js';
import AsignacionPrediccionModal from './AsignacionPrediccionModal.js';


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
			url: '/tarea/leer_tareas/',
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
				<tr className="row-md" key={asignacion.id_tarea}>
					<th scope="row">{index + 1}</th>	
					<td>{asignacion.tarea_evaluacion}</td>				
					<td>{asignacion.tarea_descripcion}</td>
					<td>{asignacion.tarea_complejidad_estimada}</td>	
					<td>{asignacion.tarea_tipo}</td>
					<td>{asignacion.tarea_participantes}</td>
					<td>{asignacion.tarea_activa == true ? "SI" : "NO"}</td>
					<td>{asignacion.tarea_fecha_inicio != null ? asignacion.tarea_fecha_inicio.split('T')[0] : asignacion.tarea_fecha_inicio}</td>					
					<td>{asignacion.tarea_fecha_fin != null ? asignacion.tarea_fecha_fin.split('T')[0] : asignacion.tarea_fecha_fin}</td>					
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
						<th scope="col">Evaluación</th>	
						<th scope="col">Descripción</th>	
						<th scope="col">Compljidad</th>	
						<th scope="col">Tipo de Tarea</th>	
						<th scope="col">Participantes</th>	
						<th scope="col">Activa</th>	
						<th scope="col">Inicio</th>
						<th scope="col">Fin</th>
						<th scope="col">Modificar</th>
						<th scope="col">Eliminar</th>
						<th scope="col">Evaluar</th>
						<th scope="col">Predicción</th>
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

