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


export default function EntidadOrigenModificarModal( props ) {
	
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
			url: "/actualizar_entidad_origen/" + props.entidad.id_entidad_origen,
			data: {
				org_nombre: formik.values.org_nombre,
				org_siglas: formik.values.org_siglas,
				org_nivel_tecnologico: formik.values.org_nivel_tecnologico,
				org_transporte: formik.values.org_transporte,
				org_trab_remoto: formik.values.org_trab_remoto								
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Entidad Origen actualizada"+ Math.random());
				Swal.fire("Entidad Origen actualizada exitosamente", "", "success");
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
		if (props.entidad.id_entidad_origen != null){	
			setShow(true);  
		}else{
			Swal.fire("No se ha seleccionado Entidad Origen", "", "error");
		}
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({
		org_nombre: Yup.string().trim()
			.required("Se requiere el nombre de la entidad"),
			//.test("Solo letras", "Introduzca letras", isNameOnly),
		org_siglas: Yup.string().trim()	
			.min(2, "Las siglas deben contener más de 3 letras")
			.max(25, "Las siglas no exceder las 25 letras")
			.required("Se requiere introduzca las siglas de la de la entidad"),
			//.test("Solo letras mayúsculas y números", "Introduzca letras mayúsculas y numéricos", siglasOnly),
		org_nivel_tecnologico: Yup.string().trim()	
			.required("Se requiere seleccione una opción"),
		org_transporte: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opción")
			.required("Se requiere marque una opción"),
		org_trab_remoto: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opción")
			.required("Se requiere marque una opción"),	
	});
	
	const registerInitialValues = {
		org_nombre: props.entidad.org_nombre,
		org_siglas: props.entidad.org_siglas,
		org_nivel_tecnologico: props.entidad.org_nivel_tecnologico,
		org_transporte: props.entidad.org_transporte,
		org_trab_remoto: props.entidad.org_trab_remoto		
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Save data...")
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
	
	const handleRadioTransporte = e => formik.values.radioButtonValue = e.target.value
	
	const handleRadioTeleTrab = e => formik.values.radioButtonValue = e.target.value
		
	return (
		<>
		<button className="btn btn-sm btn-warning" onClick={handleShow}>
			Modificar 
		</button>
		<Modal show={show} onHide={handleClose} size="lm" > 
			<Modal.Header closeButton>
				<Modal.Title>
					Modificar {props.entidad.org_siglas}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<form className="form-control" onSubmit={formik.handleSubmit}>
					<div className="form-group mt-3" id="org_nombre">
						<label>Introduzca el nombre de la entidad origen</label>
						<input
						  type="text"
						  name="org_nombre"
						  value={formik.values.org_nombre}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.org_nombre && formik.touched.org_nombre
										? "is-invalid" : "" )}
						  placeholder="Nombre de entidad (ej. Universidad de Ciego de Ávila Máximo Gómez Báez)"
						/>					
						<div>{(formik.errors.org_nombre) ? <p style={{color: 'red'}}>{formik.errors.org_nombre}</p> : null}</div>
					</div>
					<div className="form-group mt-3">
						<label>Introduzca las siglas para la entidad origen</label>
						<input
						  type="text"
						  name="org_siglas"
						  value={formik.values.org_siglas}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.org_siglas && formik.touched.org_siglas
										? "is-invalid" : "" )}
						  placeholder="Siglas para la entidad origen (ej.UNICA)"
						/>					
						<div>{(formik.errors.org_siglas) ? <p style={{color: 'red'}}>{formik.errors.org_siglas}</p> : null}</div>
					</div>				
					<div className="form-group mt-3">
						<label>Seleccione el nivel tecnológico de la entidad</label>
						<select
						  type="text"
						  name="org_nivel_tecnologico"
						  value={formik.values.org_nivel_tecnologico}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.org_nivel_tecnologico && formik.touched.org_nivel_tecnologico
										? "is-invalid" : "" )
									}					  
						>
							{RenderOptions(nivel_tecno_options)} 
						</select>
						<div>{(formik.errors.org_nivel_tecnologico) ? <p style={{color: 'red'}}>{formik.errors.org_nivel_tecnologico}</p> : null}</div>
					</div>				
					<div className="form-group mt-3">			
						<label>Marque la opción correcta para el transporte en la entidad</label>
						<br/>
						<label>Tiene transporte (Si): </label>
						<input
						  type="radio"
						  name="org_transporte"
						  value={true}
						  onChange={formik.getFieldProps("org_transporte").onChange}
						  //{...formik.getFieldProps("org_transporte")}					  
						/>	
						<br/>
						<label>Tiene transporte (No): </label>
						<input
						  type="radio"
						  name="org_transporte"
						  value={false}
						  onChange={formik.getFieldProps("org_transporte").onChange}
						  //{...formik.getFieldProps("org_transporte")}					  
						/>			
					</div>			
					<div className="form-group mt-3">			
						<label>Marque la opción correcta para la posibilidad de trabajo remoto en la entidad</label>
						<br/>
						<label>Puede trabajar remoto (Si): </label>
						<input
						  type="radio"
						  name="org_trab_remoto"
						  value={true}
						  onChange={formik.getFieldProps("org_trab_remoto").onChange}
						  //{...formik.getFieldProps("org_trab_remoto")}					  
						/>	
						<br/>
						<label>Puede trabajar remoto (No): </label>
						<input
						  type="radio"
						  name="org_trab_remoto"
						  value={false}
						  onChange={formik.getFieldProps("org_trab_remoto").onChange}
						  //{...formik.getFieldProps("org_trab_remoto")}					  
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