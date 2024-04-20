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


export default function ActividadesProfesorOpinionModal( props ) {
	
	const { token, setMessages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	const [asignaciones, setAsignaciones] = useState([]);	
	
	const profesorOpinionActividades = async () => {
		
		await axios({
			method: 'put',
			url: "/actualizar_actividad_tarea_profesor/" + props.actividad.id_actividad_tarea,
			data: {
				act_prof_memo: formik.values.act_prof_memo						
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Opinion profesor de actividad actualizado"+ Math.random());
				Swal.fire("Opinión profesor de actividad actualizado exitosamente", "", "success");
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
		act_prof_memo: Yup.string().trim()
			.required("Se requiere el nombre para la actividad")			
	});
	
	const registerInitialValues = {
		act_prof_memo: props.actividad.act_prof_memo
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Modificando data...")
			console.log(values)
			profesorOpinionActividades();
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
					<div className="form-group mt-3" id="act_prof_memo">
						<label>Introduzca la estrategia del profesor para desarrollar la actividad</label>
						<textarea
						  rows="2"
						  name="act_prof_memo"
						  value={formik.values.act_prof_memo}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.act_prof_memo && formik.touched.act_prof_memo
										? "is-invalid" : "" )}
						  placeholder="Estrategia para el profesor"
						>
						</textarea>
						<div>{(formik.errors.act_prof_memo) ? <p style={{color: 'red'}}>{formik.errors.act_prof_memo}</p> : null}</div>
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