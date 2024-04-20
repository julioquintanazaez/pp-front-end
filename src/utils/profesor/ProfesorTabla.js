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

import ProfesorEliminar from './../profesor/ProfesorEliminar.js';
import ProfesorModificarModal from './../profesor/ProfesorModificarModal.js';

const ProfesorTabla = (props) => {
	
	const { token, user } = useContext(Context);
	const { messages, setMessages } = useContext(Context);
	const { handleLogout } = useContext(Context);
	const [profesores, setProfsores] = useState([]);	
	
	useEffect(()=> {
        fetchProfesores();
    }, [messages]);	
	
	const fetchProfesores = async () => {
		await axios({
			method: 'get',
			url: '/leer_profesores/',
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setProfsores(response.data);			
				console.log("Se leyeron correctamente los profesores desde la base de datos");
			}
			else{
				console.log({"Error en response ":response.data});	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			Swal.fire("Problemas para leer profesores desde la base de datos", "", "error");
			handleLogout();
		});			  
	}
	
	const renderTableData = () => {
		return profesores?.map((profesor, index) => (
				<tr className="row-md" key={profesor.id_profesor}>
					<th scope="row">{index + 1}</th>					
					<td>{profesor.nombre} {profesor.primer_appellido} {profesor.segundo_appellido}</td>
					<td>{profesor.email}</td>					
					<td>{profesor.prf_categoria_docente}</td>
					<td>{profesor.prf_categoria_cientifica}</td>
					<td>{profesor.prf_experiencia_practicas == true ? "SI" : "NO"}</td>
					<td>{profesor.prf_numero_est_atendidos}</td>
					<td>{profesor.org_siglas}</td>
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
									< ProfesorModificarModal profesor={profesor} />
								</div>
							</div>								
						</div>							
					</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ProfesorEliminar profesor={profesor} />
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
						<th scope="col">Correo</th>										
						<th scope="col">Categoría Docente</th>	
						<th scope="col">Categoría Científica</th>	
						<th scope="col">Expriencia en Prácticas Profesionales</th>	
						<th scope="col"># Estudiantes</th>	
						<th scope="col">Entidad</th>
						<th scope="col">Detalles</th>
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

export default ProfesorTabla;

