import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import moment from "moment";
import Swal from 'sweetalert2';
import { Table } from 'react-bootstrap';

import EntidadDestinoEliminar from './../destino/EntidadDestinoEliminar.js';
import EntidadDestinoModificarModal from './../destino/EntidadDestinoModificarModal.js';

const EntidadDestinoTabla = (props) => {
	
	const { token, user } = useContext(Context);
	const { messages, setMessages } = useContext(Context);
	const { handleLogout } = useContext(Context);
	const [entidades, setEntidades] = useState([]);	
	
	useEffect(()=> {
        fetchEntidadesDestino();
    }, [messages]);	
	
	const fetchEntidadesDestino = async () => {
		await axios({
			method: 'get',
			url: '/centro/leer_centropracticas/',
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setEntidades(response.data);			
				console.log("Se leyeron correctamente las entidades desde la base de datos");
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
				<tr className="row-md" key={entidad.id_centro}>
					<th scope="row">{index + 1}</th>					
					<td>{entidad.centro_nombre}</td>
					<td>{entidad.centro_siglas}</td>
					<td>{entidad.centro_tec}</td>
					<td>{entidad.centro_transp == true ? "SI" : "NO"}</td>
					<td>{entidad.centro_experiencia == true ? "SI" : "NO"}</td>
					<td>{entidad.centro_teletrab == true ? "SI" : "NO"}</td>					
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< EntidadDestinoModificarModal entidad={entidad} />
								</div>
							</div>								
						</div>							
					</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< EntidadDestinoEliminar entidad={entidad} />
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
						<th scope="col">Experiencia</th>
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

export default EntidadDestinoTabla;

