import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import moment from "moment";
import Swal from 'sweetalert2';
import { Table } from 'react-bootstrap';

import ActividadesEliminar from './../actividades/ActividadesEliminar.js';
import ActividadesNombreModificarModal from './../actividades/ActividadesNombreModificarModal.js';
import ActividadesEvaluarModal from './../actividades/ActividadesEvaluarModal.js';
import ActividadesEstudianteOpinionModal from './../actividades/ActividadesEstudianteOpinionModal.js';
import ActividadesClienteOpinionModal from './../actividades/ActividadesClienteOpinionModal.js';
import ActividadesProfesorOpinionModal from './../actividades/ActividadesProfesorOpinionModal.js';

const ActividadesTabla = (props) => {
	
	const { token, user } = useContext(Context);
	const { messages, setMessages } = useContext(Context);
	const { handleLogout } = useContext(Context);
	const [actividades, setActividades] = useState([]);	
	
	useEffect(()=> {
        fetchActividades();
    }, [messages]);	
	
	const fetchActividades = async () => {
		await axios({
			method: 'get',
			url: '/leer_actividades_tareas/',
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setActividades(response.data);			
				console.log("Se leyeron correctamente las actividades desde la base de datos");
			}
			else{
				console.log({"Error en response ":response.data});	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			Swal.fire("Problemas para leer actividades desde la base de datos", "", "error");
			handleLogout();
		});			  
	}
	
	const renderTableData = () => {
		return actividades?.map((actividad, index) => (
				<tr className="row-md" key={actividad.id_actividad_tarea}>
					<th scope="row">{index + 1}</th>					
					<td>{actividad.act_nombre}</td>
					<td>{actividad.act_est_memo}</td>	
					<td>{actividad.act_prof_memo}</td>
					<td>{actividad.act_cli_memo}</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ActividadesNombreModificarModal actividad={actividad} />
								</div>
							</div>								
						</div>							
					</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ActividadesEliminar actividad={actividad} />
								</div>
							</div>	
						</div>							
					</td>	
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ActividadesProfesorOpinionModal actividad={actividad} />
								</div>
							</div>								
						</div>							
					</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ActividadesClienteOpinionModal actividad={actividad} />
								</div>
							</div>	
						</div>							
					</td>	
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ActividadesEstudianteOpinionModal actividad={actividad} />
								</div>
							</div>								
						</div>							
					</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ActividadesEvaluarModal actividad={actividad} />
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
						<th scope="col">Nombre</th>	
						<th scope="col">Estudiante Memo</th>	
						<th scope="col">Profesor Mmo</th>	
						<th scope="col">Cliente Memo</th>	
						<th scope="col">Modificar</th>
						<th scope="col">Eliminar</th>
						<th scope="col">Profesor</th>
						<th scope="col">Cliente</th>
						<th scope="col">Estudiante</th>
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

export default ActividadesTabla;

