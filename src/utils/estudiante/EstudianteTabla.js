import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import moment from "moment";
import Swal from 'sweetalert2';
import { Table } from 'react-bootstrap';

import EstudianteEliminar from './../estudiante/EstudianteEliminar.js';
import EstudianteModificarModal from './../estudiante/EstudianteModificarModal.js';

const EstudianteTabla = (props) => {
	
	const { token, user } = useContext(Context);
	const { messages, setMessages } = useContext(Context);
	const { handleLogout } = useContext(Context);
	const [estudiantes, setEstudiantes] = useState([]);	
	
	useEffect(()=> {
        fetchEstudiantes();
    }, [messages]);	
	
	const fetchEstudiantes = async () => {
		await axios({
			method: 'get',
			url: '/leer_estudiantes/',
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setEstudiantes(response.data);			
				console.log("Se leyeron correctamente los estudiantes desde la base de datos");
			}
			else{
				console.log({"Error en response ":response.data});	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			Swal.fire("Problemas para leer estudiantes desde la base de datos", "", "error");
			handleLogout();
		});			  
	}
	
	const renderTableData = () => {
		return estudiantes?.map((estudiante, index) => (
				<tr className="row-md" key={estudiante.id_estudiante}>
					<th scope="row">{index + 1}</th>					
					<td>{estudiante.nombre} {estudiante.primer_appellido} {estudiante.segundo_appellido}</td>
					<td>{estudiante.email}</td>					
					<td>{estudiante.est_posibilidad_economica}</td>
					<td>{estudiante.est_trabajo == true ? "SI" : "NO"}</td>
					<td>{estudiante.est_becado == true ? "SI" : "NO"}</td>
					<td>{estudiante.org_siglas}</td>
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
									< EstudianteModificarModal estudiante={estudiante} />
								</div>
							</div>								
						</div>							
					</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< EstudianteEliminar estudiante={estudiante} />
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
						<th scope="col">Acceso econůmico</th>	
						<th scope="col">Trabajo</th>	
						<th scope="col">Beca</th>
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

export default EstudianteTabla;

