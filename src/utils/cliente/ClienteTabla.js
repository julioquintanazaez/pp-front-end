import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import moment from "moment";
import Swal from 'sweetalert2';
import { Table } from 'react-bootstrap';
import { BiLike } from 'react-icons/bi';
import { BiBox } from 'react-icons/bi';   

import ClienteEliminar from './../cliente/ClienteEliminar.js';
import ClienteModificarModal from './../cliente/ClienteModificarModal.js';

export default function ClienteTabla ( props ) {

	const { token, user } = useContext(Context);
	const { messages, setMessages } = useContext(Context);
	const { handleLogout } = useContext(Context);
	const [clientes, setClientes] = useState([]);	
	
	useEffect(()=> {
        fetchClientes();
    }, [messages]);	
	
	const fetchClientes = async () => {
		await axios({
			method: 'get',
			url: '/cliente/leer_clientes/',
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setClientes(response.data);			
				console.log("Se leyeron correctamente los clientes desde la base de datos");
			}
			else{
				console.log({"Error en response ":response.data});	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			Swal.fire("Problemas para leer clientes desde la base de datos", "", "error");
			handleLogout();
		});			  
	}
	
	const renderTableData = () => {
		return clientes?.map((cliente, index) => (
				<tr className="row-md" key={cliente.id_cliente}>
					<th scope="row">{index + 1}</th>		
					<td>{cliente.nombre + " " + cliente.primer_appellido + " " + cliente.segundo_appellido }</td>	
					<td>{cliente.cli_categoria_docente}</td>
					<td>{cliente.cli_categoria_cientifica}</td>
					<td>{cliente.cli_pos_tecnica_hogar}</td>
					<td>{cliente.cli_pos_tecnica_trabajo}</td>	
					<td>{cliente.cli_experiencia_practicas == true ? "SI" : "NO"}</td>
					<td>{cliente.cli_trab_remoto == true ? "SI" : "NO"}</td>
					<td>{cliente.cli_cargo == true ? "SI" : "NO"}</td>	
					<td>{cliente.cli_numero_est_atendidos}</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ClienteModificarModal cliente={cliente} />
								</div>
							</div>								
						</div>							
					</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ClienteEliminar cliente={cliente} />
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
						<th scope="col">Categoría Docente</th>	
						<th scope="col">Categoría Científica</th>	
						<th scope="col">Tec. Hogar</th>
						<th scope="col">Tec. Trabajo</th>
						<th scope="col">Expriencia</th>	
						<th scope="col">Cargo</th>
						<th scope="col">Teletrabajo</th>
						<th scope="col"># Estudiantes</th>	
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



