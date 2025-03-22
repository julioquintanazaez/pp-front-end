import React, {useState, useEffect, useContext} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from '../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';


export default function AsignacionPrediccionModal( props ) {
	
	const { token, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	const [prediccion, setPrediccion] = useState({});
	
	
	const prediccionAsignacion = async () => {
		
		await axios({
			method: 'get',
			url: "/tarea/prediccion_tarea/" + props.asignacion.id_tarea,
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				console.log(response.data);
				setPrediccion(response.data);
			}else{
				setPrediccion({});
				Swal.fire("No existen datos suficientes", "", "success");
				setShow(false);
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});				  
	}
  
	const handleClose = () => {
		setShow(false);
	}
	
	const handleShow = () => {
		if (props.asignacion.id_tarea != null){	
			setShow(true);  
			prediccionAsignacion();
		}else{
			Swal.fire("No se ha seleccionado tarea", "", "error");
		}
	}
	
	const RenderOptions = (listValues) => {
		return (
			listValues.map(item => 
				<option value={item.value} label={item.label}>{item.value}</option>
			) 
		)
	};
	
	return (
		<>
		<button className="btn btn-sm btn-success" onClick={handleShow}>
			Predicción 
		</button>
		<Modal show={show} onHide={handleClose} size="lm" > 
			<Modal.Header closeButton>
				<Modal.Title>
					Predicción {props.asignacion.tarea_descripcion} 
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<h3> Resultado de la predicción </h3>
				<h5>Predicción: {
					(prediccion.prob1 <= 0.5) ?
						(<span className="badge bg-success">  {prediccion.clase} </span>)
					:			
						(<span className="badge bg-danger">  {prediccion.clase} </span>)
					}
				</h5>
			
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