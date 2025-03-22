import React, {useState, useEffect, useContext} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from '../../context/Context';
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


export default function AsignacionEvaluarModal( props ) {
	
	const { token, setMessages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	
	//Options configurations
	const evaluacion_options = [
								{ value: "Mejorable", label: "Mejorable" },
								{ value: "Positiva", label: "Positiva" }
							];	
	
	const evaluarAsignacion = async () => {
		
		await axios({
			method: 'put',
			url: "/tarea/evaluar_tarea/" + props.asignacion.id_tarea,
			data: {
				tarea_evaluacion : formik.values.tarea_evaluacion						
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Tarea evaluada exitosamente"+ Math.random());
				Swal.fire("Tarea evaluada exitosamente", "", "success");
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
		}else{
			Swal.fire("No se ha seleccionado una tarea", props.asignacion.id_tarea, "error");
		}
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		tarea_evaluacion: Yup.string().trim()
			.required("Se requiere seleccione una evaluación")
	});
	
	//console.log(props.asignacion.asg_fecha_inicio)
	
	const registerInitialValues = {
		tarea_evaluacion : props.asignacion.tarea_evaluacion,
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Modificando data...")
			console.log(values)
			evaluarAsignacion();
			formik.resetForm();
			handleClose();
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
					Modificar {props.asignacion.tarea_tipo} 
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<form className="form-control" onSubmit={formik.handleSubmit}>
					<div className="form-group mt-3" id="tarea_evaluacion">
						<label>Seleccione la evaluación para la tarea</label>
						<select
						  type="text"
						  name="tarea_evaluacion"
						  value={formik.values.tarea_evaluacion}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.tarea_evaluacion && formik.touched.tarea_evaluacion
										? "is-invalid" : "" )
									}>
							{RenderOptions(evaluacion_options)} 
						</select>
						<div>{(formik.errors.tarea_evaluacion) ? <p style={{color: 'red'}}>{formik.errors.tarea_evaluacion}</p> : null}</div>
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