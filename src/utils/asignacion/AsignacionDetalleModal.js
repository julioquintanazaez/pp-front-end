import React, {useState, useEffect, useContext} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from './../../context/Context';
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


export default function AsignacionDetalleModal( props ) {
	
	const { token, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	const [prediccion, setPrediccion] = useState({});
	
	
	const detalleAsignacion = async () => {
		
		await axios({
			method: 'get',
			url: "/predecir_asignacion/" + props.asignacion.id_asignacion,
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 200) {
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
		if (props.asignacion.id_asignacion != null){	
			setShow(true);  
			detalleAsignacion();
		}else{
			Swal.fire("No se ha seleccionado Concertacion", props.asignacion.id_asignacion, "error");
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
			Detalles 
		</button>
		<Modal show={show} onHide={handleClose} size="lm" > 
			<Modal.Header closeButton>
				<Modal.Title>
					Detalles {props.asignacion.asg_tema} 
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<h3> Resultado de la prediccion </h3>
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