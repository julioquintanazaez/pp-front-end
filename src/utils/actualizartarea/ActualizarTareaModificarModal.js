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


export default function ActualizarTareaModificarModal( props ) {
	
	const { token, setMessages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);	
	
	const modificarActualizarTarea = async () => {
		
		await axios({
			method: 'put',
			url: "/actualizar_actualizacion_tarea/" + props.actualizartarea.id_tareas_act,
			data: {
				memo_actualizacion: formik.values.memo_actualizacion,
				id_asg_upd: formik.values.id_asg_upd									
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Actualización realizada"+ Math.random());
				Swal.fire("Actualización de asignación realizada exitosamente", "", "success");
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
		if (props.actualizartarea.id_tareas_act != null){	
			setShow(true);  
		}else{
			Swal.fire("No se ha seleccionado la Actualización ", props.actualizartarea.id_tareas_act, "error");
		}
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		memo_actualizacion: Yup.string().trim()
			.required("Se requiere el memo descriptivo para la Asignación de tarea")
	});
	
	const registerInitialValues = {
		memo_actualizacion : props.actualizartarea.memo_actualizacion
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Modificando data...")
			console.log(values)
			modificarActualizarTarea();
			formik.resetForm();
		},
		validationSchema: validationRules
	});

	return (
		<>
		<button className="btn btn-sm btn-warning" onClick={handleShow}>
			Modificar 
		</button>
		<Modal show={show} onHide={handleClose} size="lm" > 
			<Modal.Header closeButton>
				<Modal.Title>
					Modificar {props.actualizartarea.memo_actualizacion} 
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<form className="form-control" onSubmit={formik.handleSubmit}>
					<div className="form-group mt-3" id="memo_actualizacion">
						<label>Introduzca la descripción para la actualización de la asignación</label>
						<textarea
						  rows="2"
						  name="memo_actualizacion"
						  value={formik.values.memo_actualizacion}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.memo_actualizacion && formik.touched.memo_actualizacion
										? "is-invalid" : "" )}
						  placeholder="Memo descriptivo para la actialización de la asignación"
						>
						</textarea>
						<div>{(formik.errors.memo_actualizacion) ? <p style={{color: 'red'}}>{formik.errors.memo_actualizacion}</p> : null}</div>
					</div>			
					<div className="d-grid gap-2 mt-3">
						<button type="submit" className="btn btn-success">
								Guardar datos
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