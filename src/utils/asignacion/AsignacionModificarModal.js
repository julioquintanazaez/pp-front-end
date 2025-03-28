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

	const tipos_de_tarea = [
								{ value: "Desarrollo", label: "Desarrollo" },
								{ value: "Investigacion", label: "Investigación" },
								{ value: "Documentacion", label: "Documentación" },
                                { value: "Comunicacion", label: "Comunicación" },
                                { value: "Revision", label: "Revisión" }
							];	
	
	const formatDate = (date) => {		
		return date.toISOString().split('T')[0]
	};	

	const modificarAsignacion = async () => {
		
		await axios({
			method: 'put',
			url: "/tarea/actualizar_tarea/" + props.asignacion.id_tarea,
			data: {
				tarea_tipo : formik.values.tarea_tipo,
                tarea_descripcion : formik.values.tarea_descripcion,
				tarea_fecha_inicio : formatDate(formik.values.tarea_fecha_inicio),
				tarea_fecha_fin : formatDate(formik.values.tarea_fecha_fin),
				tarea_complejidad_estimada : formik.values.tarea_complejidad_estimada,
				tarea_participantes : formik.values.tarea_participantes,
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Tarea actualizada"+ Math.random());
				Swal.fire("Tarea actualizada exitosamente", "", "success");
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
			Swal.fire("No se ha seleccionado una Tarea", props.asignacion.id_tarea, "error");
		}
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		tarea_descripcion: Yup.string().trim()
			.required("Se requiere el tema para la tarea"),
		tarea_fecha_inicio: Yup.date()
			.required("Se requiere la valoración para la tarea"),
		tarea_fecha_fin: Yup.date()
			.required("Se requiere la valoración del profesor para la tarea")
			.min(Yup.ref("tarea_fecha_inicio"), "La fecha de fin debe ser superior a la de inicio"),
		tarea_complejidad_estimada: Yup.string().trim()
			.required("Se requiere la valoración del cliente para la tarea"),
		tarea_tipo: Yup.string().trim()
			.required("Se requiere el tipo de tarea"),
		tarea_participantes: Yup.number()
			.required("Se requiere el nivel de complejidad para la tarea"),
	});
	
	//console.log(props.asignacion.asg_fecha_inicio)
	
	const registerInitialValues = {
		tarea_tipo : props.asignacion.tarea_descripcion,
		tarea_descripcion : props.asignacion.tarea_descripcion,
		tarea_fecha_inicio : Date.parse(props.asignacion.tarea_fecha_inicio.toString()), 
		tarea_fecha_fin : new Date(), //Date.parse(props.asignacion.tarea_fecha_fin.toString()), 
		tarea_complejidad_estimada : props.asignacion.tarea_complejidad_estimada,
		tarea_participantes : props.asignacion.tarea_participantes
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Modificando datos...")
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
					Modificar {props.asignacion.tarea_descripcion} 
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
			<form className="form-control" onSubmit={formik.handleSubmit}>
					<div className="form-group mt-3" id="tarea_descripcion">
						<label>Introduzca la descripción para la tarea</label>
						<textarea
						  rows="2"
						  name="tarea_descripcion"
						  value={formik.values.tarea_descripcion}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.tarea_descripcion && formik.touched.tarea_descripcion
										? "is-invalid" : "" )}
						  placeholder="Descripción de la asignación"
						>	
						</textarea>
						<div>{(formik.errors.tarea_descripcion) ? <p style={{color: 'red'}}>{formik.errors.tarea_descripcion}</p> : null}</div>
					</div>
                    <div className="form-group mt-3" id="tarea_tipo">
						<label>Seleccione el tipo de trabajo para la tarea</label>
						<select
						  type="text"
						  name="tarea_tipo"
						  value={formik.values.tarea_tipo}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.tarea_tipo && formik.touched.tarea_tipo
										? "is-invalid" : "" )
									}>
							{RenderOptions(tipos_de_tarea)} 
						</select>
						<div>{(formik.errors.tarea_tipo) ? <p style={{color: 'red'}}>{formik.errors.tarea_tipo}</p> : null}</div>
					</div>
					<div className="form-group mt-3" id="tarea_fecha_inicio">
						<label>Introduzca fecha de inicio para la asignación: </label>
						<DatePicker
						  dateFormat="dd/MM/yyyy"
						  id="tarea_fecha_inicio"
						  name="tarea_fecha_inicio"
						  selected={formik.values.tarea_fecha_inicio}					  
						  onChange={(value) => formik.setFieldValue("tarea_fecha_inicio", value)}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.tarea_fecha_inicio && formik.touched.tarea_fecha_inicio
										? "is-invalid" : "" )}
						  placeholder="Selecciona una fecha para la tarea"
						/>					
						<div>{(formik.errors.tarea_fecha_inicio) ? <p style={{color: 'red'}}>{formik.errors.tarea_fecha_inicio}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="tarea_fecha_fin">
						<label>Introduzca fecha de fin para la tarea: </label>
						<DatePicker
						  dateFormat="dd/MM/yyyy"
						  id="tarea_fecha_fin"
						  name="tarea_fecha_fin"
						  selected={formik.values.tarea_fecha_fin}					  
						  onChange={(value) => formik.setFieldValue("tarea_fecha_fin", value)}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.tarea_fecha_fin && formik.touched.tarea_fecha_fin
										? "is-invalid" : "" )}
						  placeholder="Selecciona una fecha para la tarea"
						/>							
						<div>{(formik.errors.tarea_fecha_fin) ? <p style={{color: 'red'}}>{formik.errors.tarea_fecha_fin}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="tarea_complejidad_estimada">
						<label>Seleccione el nivel del complejidad para la tarea</label>
						<select
						  type="text"
						  name="tarea_complejidad_estimada"
						  value={formik.values.tarea_complejidad_estimada}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.tarea_complejidad_estimada && formik.touched.tarea_complejidad_estimada
										? "is-invalid" : "" )
									}>
							{RenderOptions(complejidad_options)} 
						</select>
						<div>{(formik.errors.tarea_complejidad_estimada) ? <p style={{color: 'red'}}>{formik.errors.tarea_complejidad_estimada}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="tarea_participantes">
						<label>Introduzca el número de participantes en el equipo</label>
						<input
						  type="text"
						  name="tarea_participantes"
						  value={formik.values.tarea_participantes}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.tarea_participantes && formik.touched.tarea_participantes
										? "is-invalid" : "" )}
						  placeholder="Número de participantes"
						/>					
						<div>{(formik.errors.tarea_participantes) ? <p style={{color: 'red'}}>{formik.errors.tarea_participantes}</p> : null}</div>
					</div>
					<div className="d-grid gap-2 mt-3">
						<button type="submit" className="btn btn-success">
								Modificar
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