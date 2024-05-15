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


export default function AsignacionModificarActoresModal( props ) {
	
	const { token, setMessages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	const [estudiantes, setEstudiantes] = useState([]);
	
	const modificarActoresAsignacion = async () => {
		
		await axios({
			method: 'put',
			url: "/actualizar_asignacion_tarea_gestor/" + props.asignacion.id_asignacion,
			data: {
				asg_estudiante_id : formik.values.asg_estudiante_id					
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Actores asignacion actualizado"+ Math.random());
				Swal.fire("Actores asignacion actualizado exitosamente", "", "success");
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
			Swal.fire("No se ha seleccionado la Asignación de tema", props.asignacion.id_asignacion, "error");
		}
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		asg_estudiante_id: Yup.string().trim()
			.required("Se requiere el profesor para la concertacion")		
	});
	
	//console.log(props.asignacion.asg_fecha_inicio)
	
	const registerInitialValues = {
		asg_estudiante_id : ""	
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Modificando data...")
			console.log(values)
			modificarActoresAsignacion();
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
	
	useEffect(()=> {
        leerEstudiantes();
    }, []);	
	
	const leerEstudiantes = async () => {
		
		await axios({
			method: 'get',
			url: '/leer_estudiantes/',			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {	
				setEstudiantes(response.data);
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});				  
	};
	
	const RenderEstudiantes = () => {
		return (			
			estudiantes.map(item => 
				<option value={item.id_estudiante} label={item.nombre + " " + item.primer_appellido + " " + item.segundo_appellido}>
					{item.nombre + " " + item.primer_appellido + " " + item.segundo_appellido}
				</option>				
			) 
		)
	};	
	
	
			
	return (
		<>
		<button className="btn btn-sm btn-info" onClick={handleShow}>
			Actores 
		</button>
		<Modal show={show} onHide={handleClose} size="lm" > 
			<Modal.Header closeButton>
				<Modal.Title>
					Modificar {props.asignacion.asg_descripcion} 
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<form className="form-control" onSubmit={formik.handleSubmit}>
					<div className="form-group mt-3" id="asg_estudiante_id">
						<label>Seleccione el estudiante encargado para la asignación</label>
						<select
						  type="text"
						  name="asg_estudiante_id"
						  value={formik.values.asg_estudiante_id}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.asg_estudiante_id && formik.touched.asg_estudiante_id
										? "is-invalid" : "" )
									}>
							<option value="" label="Seleccione una opcion">Seleccione una opción</option>	
							{RenderEstudiantes()} 
						</select>
						<div>{(formik.errors.asg_estudiante_id) ? <p style={{color: 'red'}}>{formik.errors.asg_estudiante_id}</p> : null}</div>
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