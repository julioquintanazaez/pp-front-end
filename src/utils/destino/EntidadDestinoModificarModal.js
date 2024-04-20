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


export default function EntidadDestinoModificarModal( props ) {
	
	const { token, setMessages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);	
	
	//Options configurations
	const nivel_tecno_options = [
								{ value: "Ninguno", label: "Ninguno" },
								{ value: "Basico", label: "Basico" },
								{ value: "Medio", label: "Medio" },
								{ value: "Alto", label: "Alto" }
							];	
							
	const modificarEntidad = async () => {
		
		await axios({
			method: 'put',
			url: "/actualizar_entidad_destino/" + props.entidad.id_entidad_destino,
			data: {
				dest_nombre: formik.values.dest_nombre,
				dest_siglas: formik.values.dest_siglas,
				dest_nivel_tecnologico: formik.values.dest_nivel_tecnologico,
				dest_transporte: formik.values.dest_transporte,
				dest_trab_remoto: formik.values.dest_trab_remoto,
				dest_experiencia: formik.values.dest_experiencia
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Entidad Destino actualizada"+ Math.random());
				Swal.fire("Entidad Destino actualizada exitosamente", "", "success");
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
		if (props.entidad.id_entidad_Destino != null){	
			setShow(true);  
		}else{
			Swal.fire("No se ha seleccionado Entidad Destino", "", "error");
		}
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({
		dest_nombre: Yup.string().trim()
			.required("Se requiere el nombre de la entidad"),
			//.test("Solo letras", "Introduzca letras", isNameOnly),
		dest_siglas: Yup.string().trim()	
			.min(2, "Las siglas deben contener más de 3 letras")
			.max(25, "Las siglas no exceder las 25 letras")
			.required("Se requiere introduzca las siglas de la de la entidad"),
			//.test("Solo letras mayúsculas y números", "Introduzca letras mayúsculas y numéricos", siglasOnly),
		dest_nivel_tecnologico: Yup.string().trim()	
			.required("Se requiere seleccione una opción"),
		dest_transporte: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione una opción")
			.required("Se requiere marque una opción"),
		dest_trab_remoto: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione una opción")
			.required("Se requiere marque una opción"),	
		dest_experiencia: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione una opción")
			.required("Se requiere marque una opción"),	
	});
	
	const registerInitialValues = {
		dest_nombre: props.entidad.dest_nombre,
		dest_siglas: props.entidad.dest_siglas,
		dest_nivel_tecnologico: props.entidad.dest_nivel_tecnologico,
		dest_transporte: props.entidad.dest_transporte,
		dest_trab_remoto: props.entidad.dest_trab_remoto,
		dest_experiencia: props.entidad.dest_experiencia
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Change data...")
			console.log(values)
			modificarEntidad();
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
					Modificar {props.entidad.dest_siglas}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<form className="form-control" onSubmit={formik.handleSubmit}>
					<div className="form-group mt-3" id="dest_nombre">
						<label>Introduzca el nombre de la entidad Destino</label>
						<input
						  type="text"
						  name="dest_nombre"
						  value={formik.values.dest_nombre}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.dest_nombre && formik.touched.dest_nombre
										? "is-invalid" : "" )}
						  placeholder="Nombre de entidad (ej. Universidad de Ciego de Ávila Máximo Gómez Báez)"
						/>					
						<div>{(formik.errors.dest_nombre) ? <p style={{color: 'red'}}>{formik.errors.dest_nombre}</p> : null}</div>
					</div>
					<div className="form-group mt-3">
						<label>Introduzca las siglas para la entidad Destino</label>
						<input
						  type="text"
						  name="dest_siglas"
						  value={formik.values.dest_siglas}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.dest_siglas && formik.touched.dest_siglas
										? "is-invalid" : "" )}
						  placeholder="Siglas para la entidad Destino (ej.UNICA)"
						/>					
						<div>{(formik.errors.dest_siglas) ? <p style={{color: 'red'}}>{formik.errors.dest_siglas}</p> : null}</div>
					</div>				
					<div className="form-group mt-3">
						<label>Seleccione el nivel educativo de la madre</label>
						<select
						  type="text"
						  name="dest_nivel_tecnologico"
						  value={formik.values.dest_nivel_tecnologico}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.dest_nivel_tecnologico && formik.touched.dest_nivel_tecnologico
										? "is-invalid" : "" )
									}					  
						>
							{RenderOptions(nivel_tecno_options)} 
						</select>
						<div>{(formik.errors.dest_nivel_tecnologico) ? <p style={{color: 'red'}}>{formik.errors.dest_nivel_tecnologico}</p> : null}</div>
					</div>				
					<div className="form-group mt-3">			
						<label>Marque la opción correcta para el transporte en la entidad</label>
						<br/>
						<label>Tiene transporte (Si): </label>
						<input
						  type="radio"
						  name="dest_transporte"
						  value={true}
						  onChange={formik.getFieldProps("dest_transporte").onChange}	  
						/>	
						<br/>
						<label>Tiene transporte (No): </label>
						<input
						  type="radio"
						  name="dest_transporte"
						  value={false}
						  onChange={formik.getFieldProps("dest_transporte").onChange}	  
						/>			
					</div>			
					<div className="form-group mt-3">			
						<label>Marque la opción correcta para la posibilidad de trabajo remoto en la entidad</label>
						<br/>
						<label>Puede trabajar remoto (Si): </label>
						<input
						  type="radio"
						  name="dest_trab_remoto"
						  value={true}
						  onChange={formik.getFieldProps("dest_trab_remoto").onChange}		  
						/>	
						<br/>
						<label>Puede trabajar remoto (No): </label>
						<input
						  type="radio"
						  name="dest_trab_remoto"
						  value={false}
						  onChange={formik.getFieldProps("dest_trab_remoto").onChange}	  
						/>			
					</div>		
					<div className="form-group mt-3">			
						<label>Marque la opción correcta para experience en la entidad destino</label>
						<br/>
						<label>Tiene experiencia (Si): </label>
						<input
						  type="radio"
						  name="dest_experiencia"
						  value={true}
						  onChange={formik.getFieldProps("dest_experiencia").onChange}		  
						/>	
						<br/>
						<label>No tiene experiencia (No): </label>
						<input
						  type="radio"
						  name="dest_experiencia"
						  value={false}
						  onChange={formik.getFieldProps("dest_experiencia").onChange}	  
						/>			
					</div>		
					<div className="d-grid gap-2 mt-3">
						<button type="submit" className="btn btn-success">
								Guardar
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