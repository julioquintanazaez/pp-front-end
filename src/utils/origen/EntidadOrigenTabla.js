import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import moment from "moment";
import Swal from 'sweetalert2';
import { Table } from 'react-bootstrap';

import EntidadOrigenEliminar from './../origen/EntidadOrigenEliminar.js';
import EntidadOrigenModificarModal from './../origen/EntidadOrigenModificarModal.js';

const EntidadOrigenTabla = (props) => {
	
	const { token, user } = useContext(Context);
	const { messages, setMessages } = useContext(Context);
	const { handleLogout } = useContext(Context);
	const [entidades, setEntidades] = useState([]);	
	
	useEffect(()=> {
        fetchEntidadesOrigen();
    }, [messages]);	
	
	const fetchEntidadesOrigen = async () => {
		await axios({
			method: 'get',
			url: '/leer_entidades_origen/',
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setEntidades(response.data);			
				console.log("Se leyeron correctamente las entidades origen desde la base de datos");
			}
			else{
				console.log({"Error en response ":response.data});	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			Swal.fire("Problemas para leer entidades desde la base de datos", "", "error");
			handleLogout();
		});			  
	}
	
	const renderTableData = () => {
		return entidades?.map((entidad, index) => (
				<tr className="row-md" key={entidad.id_entidad_origen}>
					<th scope="row">{index + 1}</th>					
					<td>{entidad.org_nombre}</td>
					<td>{entidad.org_siglas}</td>
					<td>{entidad.org_nivel_tecnologico}</td>
					<td>{entidad.org_transporte == true ? "SI" : "NO"}</td>
					<td>{entidad.org_trab_remoto == true ? "SI" : "NO"}</td>	
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< EntidadOrigenModificarModal entidad={entidad} />
								</div>
							</div>								
						</div>							
					</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< EntidadOrigenEliminar entidad={entidad} />
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
						<th scope="col">Siglas</th>	
						<th scope="col">Nivel tecnologico</th>
						<th scope="col">Transporte</th>
						<th scope="col">Teletrabajo</th>
						<th scope="col">Actualizar</th>
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

export default EntidadOrigenTabla;

