import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import moment from "moment";
import Swal from 'sweetalert2';
import { Table } from 'react-bootstrap';

import TipoTareaEliminar from './../tipotarea/TipoTareaEliminar.js';
import TipoTareaModificarModal from './../tipotarea/TipoTareaModificarModal.js';
//

const TipoTareaTabla = (props) => {
	
	const { token, user } = useContext(Context);
	const { messages, setMessages } = useContext(Context);
	const { handleLogout } = useContext(Context);
	const [tipostareas, setTiposTareas] = useState([]);	
	
	useEffect(()=> {
        fetchTipoTarea();
    }, [messages]);	
	
	const fetchTipoTarea = async () => {
		await axios({
			method: 'get',
			url: '/leer_tipos_tareas/',
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setTiposTareas(response.data);			
				console.log("Se leyeron correctamente los tipos de tareas desde la base de datos");
			}
			else{
				console.log({"Error en response ":response.data});	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			Swal.fire("Problemas para leer los tipos d tareas desde la base de datos", "", "error");
			handleLogout();
		});			  
	}
	
	const renderTableData = () => {
		return tipostareas?.map((tipotarea, index) => (
				<tr className="row-md" key={tipotarea.id_tipo_tarea}>
					<th scope="row">{index + 1}</th>					
					<td>{tipotarea.tarea_tipo_nombre}</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< TipoTareaModificarModal tipotarea={tipotarea} />
								</div>
							</div>								
						</div>							
					</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< TipoTareaEliminar tipotarea={tipotarea} />
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
						<th scope="col">Tipo de tarea</th>	
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

export default TipoTareaTabla;

