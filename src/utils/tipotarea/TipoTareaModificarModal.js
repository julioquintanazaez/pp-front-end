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


export default function TipoTareaModificarModal( props ) {
	
	const { token, setMessages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	
	const modificarTipoTarea = async () => {
		
		await axios({
			method: 'put',
			url: "/actualizar_tipo_tarea/" + props.tipotarea.id_tipo_tarea,
			data: {
				tarea_tipo_nombre : formik.values.tarea_tipo_nombre						
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Tipo de Tarea actualizado"+ Math.random());
				Swal.fire("Tipo de Tarea actualizado exitosamente", "", "success");
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
		if (props.tipotarea.id_tipo_tarea != null){	
			setShow(true);  
		}else{
			Swal.fire("No se ha seleccionado Tipo de Tarea", "", "error");
		}
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		tarea_tipo_nombre: Yup.string().trim()
			.required("Se requiere el nombre para el tipo de tarea")			
	});
	
	const registerInitialValues = {
		tarea_tipo_nombre : props.tipotarea.tarea_tipo_nombre		
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Modificando data...")
			console.log(values)
			modificarTipoTarea();
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
					Modificar {props.tipotarea.tarea_tipo_nombre} 
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<form className="form-control" onSubmit={formik.handleSubmit}>
					<div className="form-group mt-3" id="tarea_tipo_nombre">
						<label>Introduzca el nombre para el tipo de tarea</label>
						<input
						  type="text"
						  name="tarea_tipo_nombre"
						  value={formik.values.tarea_tipo_nombre}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.tarea_tipo_nombre && formik.touched.tarea_tipo_nombre
										? "is-invalid" : "" )}
						  placeholder="Nombre para el tipo de tara"
						/>					
						<div>{(formik.errors.tarea_tipo_nombre) ? <p style={{color: 'red'}}>{formik.errors.tarea_tipo_nombre}</p> : null}</div>
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