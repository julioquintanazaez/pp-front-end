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


export default function ActividadesEstudianteOpinionModal( props ) {
	
	const { token, setMessages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	const [asignaciones, setAsignaciones] = useState([]);	
	
	const estudianteOpinionActividades = async () => {
		
		await axios({
			method: 'put',
			url: "/actualizar_actividad_tarea_estudiante/" + props.actividad.id_actividad_tarea,
			data: {
				act_est_memo: formik.values.act_est_memo						
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Opinion estudiante actividad actualizado"+ Math.random());
				Swal.fire("Opinión del estudiante actividad actualizado exitosamente", "", "success");
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
		if (props.actividad.id_actividad_tarea != null){	
			setShow(true);  
		}else{
			Swal.fire("No se ha seleccionado la Actividad de tema", props.actividad.id_actividad_tarea, "error");
		}
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		act_est_memo: Yup.string().trim()
			.required("Se requiere la estrategia del estudiante para la actividad")	
	});
	
	const registerInitialValues = {
		act_est_memo: props.actividad.act_est_memo
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Modificando data...")
			console.log(values)
			estudianteOpinionActividades();
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
					Modificar {props.actividad.act_nombre} 
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<form className="form-control" onSubmit={formik.handleSubmit}>
					<div className="form-group mt-3" id="act_est_memo">
						<label>Introduzca la estrategia del estudiante para desarrollar la actividad</label>
						<textarea
						  rows="2"
						  name="act_est_memo"
						  value={formik.values.act_est_memo}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.act_est_memo && formik.touched.act_est_memo
										? "is-invalid" : "" )}
						  placeholder="Estrategia del estudiante"
						>
						</textarea>
						<div>{(formik.errors.act_est_memo) ? <p style={{color: 'red'}}>{formik.errors.act_est_memo}</p> : null}</div>
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