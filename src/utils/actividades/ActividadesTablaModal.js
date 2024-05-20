import React, {useState, useEffect, useContext} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { Table } from 'react-bootstrap';

import ActividadesNombreModificarModal from './../actividades/ActividadesNombreModificarModal.js';
import ActividadesProfesorOpinionModal from './../actividades/ActividadesProfesorOpinionModal.js';
import ActividadesEvaluarModal from './../actividades/ActividadesEvaluarModal.js';
import ActividadesEliminar from './../actividades/ActividadesEliminar.js';


export default function ActividadesTablaModal( props ) {
	
	const { token, user, authroles } = useContext(Context);
	const [show, setShow] = useState(false);
	const { messages, setMessages } = useContext(Context);
	const { handleLogout } = useContext(Context);
	const [actividades, setActividades] = useState([]);		
	
	useEffect(()=> {
        fetchActividades(props.email);	
    }, [messages]);	
	
	const fetchActividades = async (email) => {
		await axios({
			method: 'get',
			url: '/leer_tareas_estudiante_por_profesor/' + email,
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
  
	const handleClose = () => {
		setShow(false);
	}
	
	const handleShow = () => {
		if (props.email != null){	
			setShow(true);  			
		}else{
			Swal.fire("No se ha seleccionado una asignacion para ver sus actividades", "", "error");
		}
	}
	
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
									< ActividadesProfesorOpinionModal actividad={actividad} />
								</div>
							</div>								
						</div>							
					</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ActividadesEliminar actividad={actividad} />
								</div>
							</div>								
						</div>							
					</td>
					<td> 
						<div className="row justify-content-center">	
							<div className="col">
								<div className="d-grid gap-2">
									< ActividadesEvaluarModal actividad={actividad} />
								</div>
							</div>								
						</div>							
					</td>
				</tr>
			));
		}
	
	return (
		<>
			<button className="btn btn-sm btn-warning" onClick={handleShow}>
				Tareas 
			</button>
			<Modal show={show} onHide={handleClose} size="lg" > 
				<Modal.Header closeButton>
					<Modal.Title>
						Actividades a realizar por el estudiante
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
				
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
								<th scope="col">Eliminar</th>
								<th scope="col">Evaluar</th>
							</tr>
						</thead>
						<tbody className="table-group-divider">						
							{renderTableData()}
						</tbody>
					</Table>
				
				</Modal.Body>
				<Modal.Footer>		
					<Button className="btn-sm" variant="secondary" onClick={handleClose}>
						Cerrar
					</Button>	  
				</Modal.Footer>
			</Modal>			
		</>
	);
}