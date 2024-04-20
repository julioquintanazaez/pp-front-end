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


export default function ConcertacionModificarModal( props ) {
	
	const { token, setMessages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	
	//Options configurations
	const complejidad_options = [
								{ value: "Baja", label: "Baja" },
								{ value: "Media", label: "Media" },
								{ value: "Alta", label: "Alta" }
							];	
							
	const modificarConcertacion = async () => {
		
		await axios({
			method: 'put',
			url: "/actualizar_concertacion/" + props.concertacion.id_conc_tema,
			data: {
				conc_tema : formik.values.conc_tema,
				conc_descripcion : formik.values.conc_descripcion,
				conc_valoracion_prof : formik.values.conc_valoracion_prof,
				conc_valoracion_cliente : formik.values.conc_valoracion_cliente,
				conc_complejidad : formik.values.conc_complejidad,
				conc_actores_externos : formik.values.conc_actores_externos				
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Concertacion actualizado"+ Math.random());
				Swal.fire("Concertacion actualizado exitosamente", "", "success");
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
		if (props.concertacion.id_conc_tema != null){	
			setShow(true);  
		}else{
			Swal.fire("No se ha seleccionado Concertacion", props.concertacion.id_conc_tema, "error");
		}
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		conc_tema: Yup.string().trim()
			.required("Se requiere el tema para la concertacion"),
		conc_descripcion: Yup.string().trim()
			.required("Se requiere la descripción para la concertacion"),
		conc_valoracion_prof: Yup.string().trim()
			.required("Se requiere la valoración del profesor para la concertacion"),
		conc_valoracion_cliente: Yup.string().trim()
			.required("Se requiere la valoración del cliente para la concertacion"),
		conc_complejidad: Yup.string().trim()
			.required("Se requiere el nivel de complejidad para la concertacion"),
		conc_actores_externos: Yup.string().trim()
			.required("Se requiere número de actores externos para la concertacion")
	});
	
	const registerInitialValues = {
		conc_tema : props.concertacion.conc_tema,
		conc_descripcion : props.concertacion.conc_descripcion,
		conc_valoracion_prof : props.concertacion.conc_valoracion_prof,
		conc_valoracion_cliente : props.concertacion.conc_valoracion_cliente,
		conc_complejidad : props.concertacion.conc_complejidad,
		conc_actores_externos : props.concertacion.conc_actores_externos
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Modificando data...")
			console.log(values)
			modificarConcertacion();
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
					Modificar {props.concertacion.conc_tema} 
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<form className="form-control" onSubmit={formik.handleSubmit}>
					<div className="form-group mt-3" id="conc_tema">
						<label>Introduzca el tema para la concertacion</label>
						<input
						  type="text"
						  name="conc_tema"
						  value={formik.values.conc_tema}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.conc_tema && formik.touched.conc_tema
										? "is-invalid" : "" )}
						  placeholder="Tema de la concertación"
						/>					
						<div>{(formik.errors.conc_tema) ? <p style={{color: 'red'}}>{formik.errors.conc_tema}</p> : null}</div>
					</div>
					<div className="form-group mt-3" id="conc_descripcion">
						<label>Introduzca la descripción para la concertacion</label>
						<textarea
						  rows="2"
						  name="conc_descripcion"
						  value={formik.values.conc_descripcion}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.conc_descripcion && formik.touched.conc_descripcion
										? "is-invalid" : "" )}
						  placeholder="Descripción para la concertacion"
						>	
						</textarea>
						<div>{(formik.errors.conc_descripcion) ? <p style={{color: 'red'}}>{formik.errors.conc_descripcion}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="conc_valoracion_prof">
						<label>Introduzca la valoración del profesor para la concertacion</label>
						<textarea
						 rows="2"
						  name="conc_valoracion_prof"
						  value={formik.values.conc_valoracion_prof}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.conc_valoracion_prof && formik.touched.conc_valoracion_prof
										? "is-invalid" : "" )}
						  placeholder="Valoración del profesor para la concertacion"
						>	
						</textarea>
						<div>{(formik.errors.conc_valoracion_prof) ? <p style={{color: 'red'}}>{formik.errors.conc_valoracion_prof}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="conc_valoracion_cliente">
						<label>Introduzca valoración del cliente para la concertacion</label>
						<textarea
						  rows="2"
						  name="conc_valoracion_cliente"
						  value={formik.values.conc_valoracion_cliente}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.conc_valoracion_cliente && formik.touched.conc_valoracion_cliente
										? "is-invalid" : "" )}
						  placeholder="Valoración del cliente para la concertacion"
						>	
						</textarea>
						<div>{(formik.errors.conc_valoracion_cliente) ? <p style={{color: 'red'}}>{formik.errors.conc_valoracion_cliente}</p> : null}</div>
					</div>					
					<div className="form-group mt-3" id="conc_complejidad">
						<label>Seleccione el nivel del complejidad para la concertacion</label>
						<select
						  type="text"
						  name="conc_complejidad"
						  value={formik.values.conc_complejidad}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.conc_complejidad && formik.touched.conc_complejidad
										? "is-invalid" : "" )
									}>
							{RenderOptions(complejidad_options)} 
						</select>
						<div>{(formik.errors.conc_complejidad) ? <p style={{color: 'red'}}>{formik.errors.conc_complejidad}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="conc_actores_externos">
						<label>Introduzca el número de actores externos para la concertacion</label>
						<input
						  type="text"
						  name="conc_actores_externos"
						  value={formik.values.conc_actores_externos}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.conc_actores_externos && formik.touched.conc_actores_externos
										? "is-invalid" : "" )}
						  placeholder="Número de actores externos"
						/>					
						<div>{(formik.errors.conc_actores_externos) ? <p style={{color: 'red'}}>{formik.errors.conc_actores_externos}</p> : null}</div>
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