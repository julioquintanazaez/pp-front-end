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


export default function ActividadesProfesorCrearActividadModal( props ) {
	
	const { token, setMessages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	const [asignaciones, setAsignaciones] = useState([]);	
	
	console.log(props.asignacion);
	
	const profesorCrearActividad = async (id) => {
		
		await axios({
			method: 'post',
			url: '/crear_actividad_tarea_profesor/' + id,
			data: {
				act_nombre: formik.values.act_nombre,
				act_prof_memo: formik.values.act_prof_memo			
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Actividad creada por profesor"+ Math.random());
				Swal.fire("Actividad creada por profesor exitosamente", "", "success");
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
		}else{
			Swal.fire("No se ha seleccionado la asignación de tema", props.asignacion.id_asignacion, "error");
		}
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({
		act_nombre: Yup.string().trim()
			.required("Se requiere el nombre para la actividad"),
		act_prof_memo: Yup.string().trim()
			.required("Se requiere el nombre para la actividad")			
	});
	
	const registerInitialValues = {
		act_nombre: "",
		act_prof_memo: ""	
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Modificando data...")
			console.log(values)
			profesorCrearActividad(props.asignacion.id_asignacion);
			formik.resetForm();
		},
		validationSchema: validationRules
	});
	
	return (
		<>
		<button className="btn btn-sm btn-warning" onClick={handleShow}>
			(+) 
		</button>
		<Modal show={show} onHide={handleClose} size="lm" > 
			<Modal.Header closeButton>
				<Modal.Title>
					<h2>Nueva tarea</h2>  
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