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


export default function ConcertacionEvaluarModal( props ) {
	
	const { token, setMessages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	
	const complejidad_options = [
								{ value: "Positiva", label: "Positiva" },
								{ value: "Mejorable", label: "Mejorable" }
							];			
	
	const evaluarConcertacion = async () => {
		
		await axios({
			method: 'put',
			url: "/concertacion/evaluar_concertacion/" + props.concertacion.id_conc_tema,
			data: {
				conc_evaluacion : formik.values.conc_evaluacion	
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Concertación evaluando"+ Math.random());
				Swal.fire("Concertación evaluada exitosamente", "", "success");
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
		if (props.concertacion.id_conc_tema != null){	
			setShow(true);  
		}else{
			Swal.fire("No se ha seleccionado Concertación", props.concertacion.id_conc_tema, "error");
		}
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		conc_evaluacion: Yup.string().trim()
			.required("Se requiere seleccione un valor para la concertación"),
	});
	
	const registerInitialValues = {
		conc_evaluacion : props.concertacion.conc_evaluacion
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Modificando data...")
			console.log(values)
			evaluarConcertacion();
			formik.resetForm();
		},
		validationSchema: validationRules
	});
	
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
			Evaluar 
		</button>
		<Modal show={show} onHide={handleClose} size="lm" > 
			<Modal.Header closeButton>
				<Modal.Title>
					Tema: {props.concertacion.conc_tema} 
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<form className="form-control" onSubmit={formik.handleSubmit}>
					<div className="form-group mt-3" id="conc_evaluacion">
						<label>Introduzca la evaluación para la concertacion</label>
						<select
						  type="text"
						  name="conc_evaluacion"
						  value={formik.values.conc_evaluacion}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.conc_evaluacion && formik.touched.conc_evaluacion
										? "is-invalid" : "" )
									}>
							{RenderOptions(complejidad_options)} 
						</select>		
						<div>{(formik.errors.conc_evaluacion) ? <p style={{color: 'red'}}>{formik.errors.conc_evaluacion}</p> : null}</div>
					</div>
					<div className="d-grid gap-2 mt-3">
						<button type="submit" className="btn btn-success">
								Guardar
						</button>					
					</div>		
				</form>
			
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