import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import moment from "moment";
import Swal from 'sweetalert2';
import { Table } from 'react-bootstrap';

import ActualizarTareaEliminar from './../actualizartarea/ActualizarTareaEliminar.js';
import ActualizarTareaModificarModal from './../actualizartarea/ActualizarTareaModificarModal.js';
//
//

const ActualizarTareaTabla = (props) => {
	
	const { token, user } = useContext(Context);
	const { messages, setMessages } = useContext(Context);
	const { handleLogout } = useContext(Context);
	const [actualizacionestarea, setActualizacionesTarea] = useState([]);	
	
	useEffect(()=> {
        fetchActualizaciones();
    }, [messages]);	
	
	const fetchActualizaciones = async () => {
		await axios({
			method: 'get',
			url: '/leer_actualizaciones_tareas/',
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setActualizacionesTarea(response.data);			
				console.log("Se leyeron correctamente las actualizaciones de tareas desde la base de datos");
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
		return actualizacionestarea?.map((actualizartarea, index) => (
				<tr className="row-md" key={actualizartarea.id_tareas_act}>
					<th scope="row">{index + 1}</th>					
					<td>{actualizartarea.memo_actualizacion}</td>
					<td>{actualizartarea.fecha_actualizacion != null ? actualizartarea.fecha_actualizacion.split('T')[0] : actualizartarea.fecha_actualizacion}</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ActualizarTareaModificarModal actualizartarea={actualizartarea} />
								</div>
							</div>								
						</div>							
					</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ActualizarTareaEliminar actualizartarea={actualizartarea} />
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
						<th scope="col">Memo</th>	
						<th scope="col">Fecha</th>	
						<th scope="col">Modificar</th>
						<th scope="col">Eliminar</th>
					</tr>
				</thead>
				<tbody className="table-group-divider">						
					{renderTableData()}
				</tbody>
			</Table>
		</>
	);
}

export default ActualizarTareaTabla;

