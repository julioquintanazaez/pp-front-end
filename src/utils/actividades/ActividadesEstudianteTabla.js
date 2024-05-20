import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import moment from "moment";
import Swal from 'sweetalert2';
import { Table } from 'react-bootstrap';

import ActividadesNombreModificarModal from './../actividades/ActividadesNombreModificarModal.js';
import ActividadesEstudianteOpinionModal from './../actividades/ActividadesEstudianteOpinionModal.js';


const ActividadesEstudianteTabla = ( props ) => {
	
	const { token, user, authroles } = useContext(Context);
	const { messages, setMessages } = useContext(Context);
	const { handleLogout } = useContext(Context);
	const [actividades, setActividades] = useState([]);	
	
	useEffect(()=> {		
		fetchActividades(user.email);			
    }, []);	
	
	const fetchActividades = async (email) => {
		await axios({
			method: 'get',
			url: '/leer_tareas_estudiante/' + email,
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setActividades(response.data);			
				console.log("Se leyeron correctamente las actividades para la asignacion desde la base de datos");
			}
			else{
				console.log({"Error en response ":response.data});	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			Swal.fire("Problemas para leer actividades de la asignacion desde la base de datos", "", "error");
			handleLogout();
		});			  
	};
	
	const renderTableData = () => {
		return actividades?.map((actividad, index) => (
				<tr className="row-md" key={actividad.id_actividad_tarea}>
					<th scope="row">{index + 1}</th>					
					<td>{actividad.act_nombre}</td>
					<td>{actividad.act_est_memo}</td>	
					<td>{actividad.act_prof_memo}</td>
					<td>{actividad.act_cli_memo}</td>
					<td>{actividad.act_resultado}</td>
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
									< ActividadesEstudianteOpinionModal actividad={actividad} />
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
						<th scope="col">Resultado</th>	
						<th scope="col">Modificar</th>
						<th scope="col">Comentar</th>
					</tr>
				</thead>
				<tbody className="table-group-divider">						
					{renderTableData()}
				</tbody>
			</Table>
		</>
	);
}

export default ActividadesEstudianteTabla;

