import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import moment from "moment";
import Swal from 'sweetalert2';
import { Table } from 'react-bootstrap';

import ConcertacionEliminar from './../concertacion/ConcertacionEliminar.js';
import ConcertacionModificarModal from './../concertacion/ConcertacionModificarModal.js';
import ConcertacionActoresModificarModal from './../concertacion/ConcertacionActoresModificarModal.js';
import ConcertacionEvaluarModal from './../concertacion/ConcertacionEvaluarModal.js';

const ConcertacionTabla = (props) => {
	
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
			url: '/leer_concertaciones/',
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
					<td>{concertacion.conc_tema}</td>
					<td>{concertacion.conc_complejidad}</td>	
					<td>{concertacion.prf_nombre}</td>
					<td>{concertacion.cli_nombre}</td>
					<td>{concertacion.org_siglas}</td>
					<td>{concertacion.dest_siglas}</td>
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
									< ConcertacionModificarModal concertacion={concertacion} />
								</div>
							</div>								
						</div>							
					</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ConcertacionEliminar concertacion={concertacion} />
								</div>
							</div>	
						</div>							
					</td>		
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ConcertacionActoresModificarModal concertacion={concertacion} />
								</div>
							</div>	
						</div>							
					</td>		
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ConcertacionEvaluarModal concertacion={concertacion} />
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
						<th scope="col">Tema</th>	
						<th scope="col">Compljidad</th>										
						<th scope="col">Profesor</th>	
						<th scope="col">Cliente</th>	
						<th scope="col">Entidad Origen</th>	
						<th scope="col">Entidad Cliente</th>
						<th scope="col">Detalles</th>
						<th scope="col">Modificar</th>
						<th scope="col">Eliminar</th>
						<th scope="col">Actores</th>
						<th scope="col">Evaluación</th>
					</tr>
				</thead>
				<tbody className="table-group-divider">						
					{renderTableData()}
				</tbody>
			</Table>
		</>
	);
}

export default ConcertacionTabla;

