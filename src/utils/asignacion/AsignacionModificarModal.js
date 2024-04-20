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


export default function AsignacionModificarModal( props ) {
	
	const { token, setMessages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	
	//Options configurations
	const complejidad_options = [
								{ value: "Baja", label: "Baja" },
								{ value: "Media", label: "Media" },
								{ value: "Alta", label: "Alta" }
							];	
	
	const modificarAsignacion = async () => {
		
		await axios({
			method: 'put',
			url: "/actualizar_asignacion_tarea/" + props.asignacion.id_asignacion,
			data: {
				asg_descripcion : formik.values.asg_descripcion,
				asg_fecha_inicio : formik.values.asg_fecha_inicio.toISOString().split('T')[0],
				asg_fecha_fin : formik.values.asg_fecha_fin.toISOString().split('T')[0],
				asg_complejidad_estimada : formik.values.asg_complejidad_estimada,
				asg_participantes : formik.values.asg_participantes				
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Asignacion actualizado"+ Math.random());
				Swal.fire("Asignacion actualizado exitosamente", "", "success");
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
		asg_descripcion: Yup.string().trim()
			.required("Se requiere el tema para la concertacion"),
		asg_fecha_inicio: Yup.date()
			.required("Se requiere la descripción para la concertacion"),
		asg_fecha_fin: Yup.date()
			.required("Se requiere la valoración del profesor para la concertacion")
			.min(Yup.ref("asg_fecha_inicio"), "La fecha de fin debe ser superior a la de inicio"),
		asg_complejidad_estimada: Yup.string().trim()
			.required("Se requiere la valoración del cliente para la concertacion"),
		asg_participantes: Yup.string().trim()
			.required("Se requiere el nivel de complejidad para la concertacion")
	});
	
	//console.log(props.asignacion.asg_fecha_inicio)
	
	const registerInitialValues = {
		asg_descripcion : props.asignacion.asg_descripcion,
		asg_fecha_inicio : Date.parse(props.asignacion.asg_fecha_inicio.toString()), 
		asg_fecha_fin : new Date(),//Date.parse(props.asignacion.asg_fecha_fin.toString()), 
		asg_complejidad_estimada : props.asignacion.asg_complejidad_estimada,
		asg_participantes : props.asignacion.asg_participantes
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Modificando data...")
			console.log(values)
			modificarAsignacion();
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
		<button className="btn btn-sm btn-warning" onClick={handleShow}>
			Modificar 
		</button>
		<Modal show={show} onHide={handleClose} size="lm" > 
			<Modal.Header closeButton>
				<Modal.Title>
					Modificar {props.asignacion.asg_descripcion} 
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<form className="form-control" onSubmit={formik.handleSubmit}>
					<div className="form-group mt-3" id="asg_tema">
						<label>Introduzca la descripción para la asignación</label>
						<textarea
						  rows="2"
						  name="asg_descripcion"
						  value={formik.values.asg_descripcion}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.asg_descripcion && formik.touched.asg_descripcion
										? "is-invalid" : "" )}
						  placeholder="Descripción de la asignación"
						>	
						</textarea>
						<div>{(formik.errors.asg_descripcion) ? <p style={{color: 'red'}}>{formik.errors.asg_descripcion}</p> : null}</div>
					</div>
					<div className="form-group mt-3" id="asg_fecha_inicio">
						<label>Introduzca fecha de inicio para la asignación: </label>
						<DatePicker
						  dateFormat="dd/MM/yyyy"
						  id="asg_fecha_inicio"
						  name="asg_fecha_inicio"
						  selected={formik.values.asg_fecha_inicio}					  
						  onChange={(value) => formik.setFieldValue("asg_fecha_inicio", value)}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.asg_fecha_inicio && formik.touched.asg_fecha_inicio
										? "is-invalid" : "" )}
						  placeholder="Selecciona una fcha para la asignación"
						/>					
						<div>{(formik.errors.asg_fecha_inicio) ? <p style={{color: 'red'}}>{formik.errors.asg_fecha_inicio}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="asg_fecha_fin">
						<label>Introduzca fecha de fin para la asignación: </label>
						<DatePicker
						  dateFormat="dd/MM/yyyy"
						  id="asg_fecha_fin"
						  name="asg_fecha_fin"
						  selected={formik.values.asg_fecha_fin}					  
						  onChange={(value) => formik.setFieldValue("asg_fecha_fin", value)}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.asg_fecha_fin && formik.touched.asg_fecha_fin
										? "is-invalid" : "" )}
						  placeholder="Selecciona una fecha para la asignación"
						/>							
						<div>{(formik.errors.asg_fecha_fin) ? <p style={{color: 'red'}}>{formik.errors.asg_fecha_fin}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="asg_complejidad_estimada">
						<label>Seleccione el nivel del complejidad para la asignación</label>
						<select
						  type="text"
						  name="asg_complejidad_estimada"
						  value={formik.values.asg_complejidad_estimada}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.asg_complejidad_estimada && formik.touched.asg_complejidad_estimada
										? "is-invalid" : "" )
									}>
							{RenderOptions(complejidad_options)} 
						</select>
						<div>{(formik.errors.asg_complejidad_estimada) ? <p style={{color: 'red'}}>{formik.errors.asg_complejidad_estimada}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="asg_participantes">
						<label>Introduzca el número de participantes para la concertacion</label>
						<input
						  type="text"
						  name="asg_participantes"
						  value={formik.values.asg_participantes}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.asg_participantes && formik.touched.asg_participantes
										? "is-invalid" : "" )}
						  placeholder="Número de participantes"
						/>					
						<div>{(formik.errors.asg_participantes) ? <p style={{color: 'red'}}>{formik.errors.asg_participantes}</p> : null}</div>
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