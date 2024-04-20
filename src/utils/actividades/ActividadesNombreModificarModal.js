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


export default function ActividadesNombreModificarModal( props ) {
	
	const { token, setMessages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	const [asignaciones, setAsignaciones] = useState([]);	
	
	const modificarActividades = async () => {
		
		await axios({
			method: 'put',
			url: "/actualizar_actividad_tarea/" + props.actividad.id_actividad_tarea,
			data: {
				act_nombre: formik.values.act_nombre											
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Actividad actualizado"+ Math.random());
				Swal.fire("Actividad actualizado exitosamente", "", "success");
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
		act_nombre: Yup.string().trim()
			.required("Se requiere el nombre para la actividad")		
	});
	
	const registerInitialValues = {
		act_nombre: props.actividad.act_nombre
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Modificando data...")
			console.log(values)
			modificarActividades();
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
					<div className="form-group mt-3" id="act_nombre">
						<label>Introduzca el nombre para la actividad</label>
						<input
						  type="text"
						  name="act_nombre"
						  value={formik.values.act_nombre}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.act_nombre && formik.touched.act_nombre
										? "is-invalid" : "" )}
						  placeholder="Nombre para la actividad"
						/>					
						<div>{(formik.errors.act_nombre) ? <p style={{color: 'red'}}>{formik.errors.act_nombre}</p> : null}</div>
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