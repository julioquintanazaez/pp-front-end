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

import AsignacionDetalleModal from '../asignacion/AsignacionPrediccionModal.js';
import ConcertacionDetalleModal from '../concertacion/ConcertacionPrediccionModal.js';

const ClienteTablaGestor = () => {
	
	const { token, user } = useContext(Context);
	const { messages, setMessages } = useContext(Context);
	const { handleLogout } = useContext(Context);
	const [concertaciones, setConcertaciones] = useState([]);	
	
	useEffect(()=> {
        fetchConcertaciones();
    }, [messages]);	
	
	const fetchConcertaciones = async () => {
		await axios({
			method: 'get',
			url: '/concertacion/leer_concertaciones_cliente/',
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setConcertaciones(response.data);			
				console.log("Se leyeron correctamente los concertaciones desde la base de datos");
			}
			else{
				console.log({"Error en response ":response.data});	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			Swal.fire("Problemas para leer concertaciones desde la base de datos", "", "error");
			handleLogout();
		});			  
	}
	
	const renderTableData = () => {
		return concertaciones?.map((concertacion, index) => (
				<tr className="row-md" key={concertacion.id_conc_tema}>
					<th scope="row">{index + 1}</th>					
					<td>{concertacion.conc_evaluacion}</td>				
					<td>{concertacion.conc_tema}</td>
					<td>{concertacion.conc_complejidad}</td>	
					<td>{concertacion.conc_actores_externos}</td>
					<td>{concertacion.conc_activa == true ? "SI" : "NO"}</td>
					<td>{concertacion.prf_nombre + " " + concertacion.prf_primer_appellido + " " + concertacion.prf_segundo_appellido}</td>
					<td>{concertacion.conc_evaluacion_pred == null ? (
						<span className="bg-danger">Sin Predicción</span>
					) : (
						<span className="bg-success">{concertacion.conc_evaluacion_pred}</span>
					)}</td>	
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
						<th scope="col">Tema</th>	
						<th scope="col">Compljidad</th>		
						<th scope="col">Equipo</th>		
						<th scope="col">Activa</th>							
						<th scope="col">Profesor</th>	
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

export default ClienteTablaGestor;

