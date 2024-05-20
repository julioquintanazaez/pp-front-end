import React, {useState, useEffect, useContext} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";
import { BiBox } from 'react-icons/bi'; 
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';


export default function ClienteModificarModal( props ) {
	
	const { token, setMessages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	
	//Options configurations
	const nivel_tecno_options = [
								{ value: "Ninguna", label: "Ninguna" },
								{ value: "Basica", label: "Basica" },
								{ value: "Media", label: "Media" },
								{ value: "Alta", label: "Alta" }
							];	
							
	const genero = [
					{ value: "M", label: "M" },
					{ value: "F", label: "F" }
				];	
	
	const estado_civil_opt = [
								{ value: "Soltero", label: "Soltero" },
								{ value: "Casado", label: "Casado" },
								{ value: "Divorciado", label: "Divorciado" },
							];	
		
	const categoria_doc_opt = [
								{ value: "Instructor", label: "Instructor" },
								{ value: "Auxiliar", label: "Auxiliar" },
								{ value: "Asistente", label: "Asistente" },
								{ value: "Titular", label: "Titular" }
							];	
							
	const categoria_cient_opt = [
								{ value: "Tecnico", label: "Tecnico" },
								{ value: "Ingeniero", label: "Ingeniero" },
								{ value: "Licenciado", label: "Licenciado" },
								{ value: "Master", label: "Master" },
								{ value: "Doctor", label: "Doctor" }
							];	
							
	const modificarCliente = async () => {
		
		await axios({
			method: 'put',
			url: "/actualizar_cliente/" + props.cliente.id_cliente,
			data: {
				cli_genero : formik.values.cli_genero,
				cli_estado_civil : formik.values.cli_estado_civil,  
				cli_numero_empleos : formik.values.cli_numero_empleos,
				cli_hijos : formik.values.cli_hijos,
				cli_pos_tecnica_trabajo : formik.values.cli_pos_tecnica_trabajo,
				cli_pos_tecnica_hogar : formik.values.cli_pos_tecnica_hogar,
				cli_cargo : formik.values.cli_cargo,
				cli_trab_remoto : formik.values.cli_trab_remoto,
				cli_categoria_docente : formik.values.cli_categoria_docente, 
				cli_categoria_cientifica : formik.values.cli_categoria_cientifica,  
				cli_experiencia_practicas : formik.values.cli_experiencia_practicas, 
				cli_numero_est_atendidos : formik.values.cli_numero_est_atendidos			
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Cliente actualizado"+ Math.random());
				Swal.fire("Cliente actualizado exitosamente", "", "success");
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
		if (props.cliente.id_cliente != null){	
			setShow(true);  
		}else{
			Swal.fire("No se ha seleccionado Cliente", props.cliente.id_cliente, "error");
		}
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		cli_genero: Yup.string().trim()
			.required("Se requiere el género del cliente"),
		cli_estado_civil: Yup.string().trim()
			.required("Se requiere el estado civil del cliente"),
		cli_numero_empleos: Yup.string().trim()
			.required("Se requiere el número de empleos del cliente"),
		cli_hijos: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opción")
			.required("Se requiere el número de hijos del cliente"),
		cli_pos_tecnica_trabajo: Yup.string().trim()
			.required("Se requiere la posibilidad técnica del trabajo del cliente"),
		cli_pos_tecnica_hogar: Yup.string().trim()
			.required("Se requiere la posibilidad técnica del hogar del cliente"),
		cli_cargo: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opción")
			.required("Se requiere marque una opción"),	
		cli_trab_remoto: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opción")
			.required("Se requiere marque una opción"),	
		cli_categoria_docente: Yup.string().trim()
			.required("Se requiere la caegoría docente del cliente"),
		cli_categoria_cientifica: Yup.string().trim()
			.required("Se requiere la caegoría científica del cliente"),
		cli_experiencia_practicas: Yup.string().trim()
			.required("Se requiere la experiencia en prácticas profesionales del cliente"),
		cli_experiencia_practicas: Yup.string().trim()
			.required("Se requiere la experiencia en prácticas profesionales del cliente"),
		cli_numero_est_atendidos: Yup.string().trim()
			.required("Se requiere el número de estudiantes atendidos por el cliente")
	});
	
	const registerInitialValues = {
		cli_genero : props.cliente.cli_genero,
		cli_estado_civil : props.cliente.cli_estado_civil,  
		cli_numero_empleos : props.cliente.cli_numero_empleos,
		cli_hijos : props.cliente.cli_hijos,
		cli_pos_tecnica_trabajo : props.cliente.cli_pos_tecnica_trabajo,
		cli_pos_tecnica_hogar : props.cliente.cli_pos_tecnica_hogar,
		cli_cargo : props.cliente.cli_cargo,
		cli_trab_remoto : props.cliente.cli_trab_remoto,
		cli_categoria_docente : props.cliente.cli_categoria_docente, 
		cli_categoria_cientifica : props.cliente.cli_categoria_cientifica,  
		cli_experiencia_practicas : props.cliente.cli_experiencia_practicas, 
		cli_numero_est_atendidos : props.cliente.cli_numero_est_atendidos
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Save data...")
			console.log(values)
			modificarCliente();
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
			< BiBox /> 
		</button>
		<Modal show={show} onHide={handleClose} size="lm" > 
			<Modal.Header closeButton>
				<Modal.Title>
					Modificar {props.cliente.cli_nombre} {props.cliente.cli_primer_appellido} {props.cliente.cli_segundo_appellido}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<form className="form-control" onSubmit={formik.handleSubmit}>
					<div className="form-group mt-3" id="cli_genero">
						<label>Seleccione el género para el cliente</label>
						<select
						  type="text"
						  name="cli_genero"
						  value={formik.values.cli_genero}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.cli_genero && formik.touched.cli_genero
										? "is-invalid" : "" )
									}>
							{RenderOptions(genero)} 
						</select>
						<div>{(formik.errors.cli_genero) ? <p style={{color: 'red'}}>{formik.errors.cli_genero}</p> : null}</div>
					</div>	
					<div className="form-group mt-3" id="cli_estado_civil">
						<label>Seleccione el estado civil para el cliente</label>
						<select
						  type="text"
						  name="cli_estado_civil"
						  value={formik.values.cli_estado_civil}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.cli_estado_civil && formik.touched.cli_estado_civil
										? "is-invalid" : "" )
									}>
							{RenderOptions(estado_civil_opt)} 
						</select>
						<div>{(formik.errors.cli_estado_civil) ? <p style={{color: 'red'}}>{formik.errors.cli_estado_civil}</p> : null}</div>
					</div>	
					<div className="form-group mt-3" id="cli_numero_empleos">
						<label>Introduzca el número de empleos del cliente</label>
						<input
						  type="text"
						  name="cli_numero_empleos"
						  value={formik.values.cli_numero_empleos}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.cli_numero_empleos && formik.touched.cli_numero_empleos
										? "is-invalid" : "" )}
						  placeholder="Número de empleos del cliente"
						/>					
						<div>{(formik.errors.cli_numero_empleos) ? <p style={{color: 'red'}}>{formik.errors.cli_numero_empleos}</p> : null}</div>
					</div>
					<div className="form-group mt-3" id="cli_hijos">			
						<label>Marque la opción correcta para hijos del cliente</label>
						<br/>
						<label>Tiene hijos (Si): </label>
						<input
						  type="radio"
						  name="cli_hijos"
						  value={true}
						  onChange={formik.getFieldProps("cli_hijos").onChange}		  
						/>	
						<br/>
						<label>No tiene hijos (No): </label>
						<input
						  type="radio"
						  name="cli_hijos"
						  value={false}
						  onChange={formik.getFieldProps("cli_hijos").onChange}	  
						/>			
					</div>	
					<div className="form-group mt-3" id="cli_pos_tecnica_trabajo">
						<label>Seleccione el nivel tecnológico para el trabajo del cliente</label>
						<select
						  type="text"
						  name="cli_pos_tecnica_trabajo"
						  value={formik.values.cli_pos_tecnica_trabajo}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.cli_pos_tecnica_trabajo && formik.touched.cli_pos_tecnica_trabajo
										? "is-invalid" : "" )
									}>
							{RenderOptions(nivel_tecno_options)} 
						</select>
						<div>{(formik.errors.cli_pos_tecnica_trabajo) ? <p style={{color: 'red'}}>{formik.errors.cli_pos_tecnica_trabajo}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="cli_pos_tecnica_hogar">
						<label>Seleccione el nivel tecnológico para el hogar del cliente</label>
						<select
						  type="text"
						  name="cli_pos_tecnica_hogar"
						  value={formik.values.cli_pos_tecnica_hogar}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.cli_pos_tecnica_hogar && formik.touched.cli_pos_tecnica_hogar
										? "is-invalid" : "" )
									}>
							{RenderOptions(nivel_tecno_options)} 
						</select>
						<div>{(formik.errors.cli_pos_tecnica_hogar) ? <p style={{color: 'red'}}>{formik.errors.cli_pos_tecnica_hogar}</p> : null}</div>
					</div>	
					<div className="form-group mt-3" id="cli_cargo">			
						<label>Marque la opción correcta para la ocupación de cargo del cliente</label>
						<br/>
						<label>Ocupa cargo (Si): </label>
						<input
						  type="radio"
						  name="cli_cargo"
						  value={true}
						  onChange={formik.getFieldProps("cli_cargo").onChange}	  
						/>	
						<br/>
						<label>No ocupa cargo (No): </label>
						<input
						  type="radio"
						  name="cli_cargo"
						  value={false}
						  onChange={formik.getFieldProps("cli_cargo").onChange}	  
						/>			
					</div>
					<div className="form-group mt-3" id="cli_trab_remoto">			
						<label>Marque la opción correcta para la posibilidad de trabajo remoto del cliente</label>
						<br/>
						<label>Puede trabajar remoto (Si): </label>
						<input
						  type="radio"
						  name="cli_trab_remoto"
						  value={true}
						  onChange={formik.getFieldProps("cli_trab_remoto").onChange}	  
						/>	
						<br/>
						<label>No puede trabajar remoto (No): </label>
						<input
						  type="radio"
						  name="cli_trab_remoto"
						  value={false}
						  onChange={formik.getFieldProps("cli_trab_remoto").onChange}		  
						/>			
					</div>		
					<div className="form-group mt-3" id="cli_categoria_docente">
						<label>Seleccione la categoría docente del cliente</label>
						<select
						  type="text"
						  name="cli_categoria_docente"
						  value={formik.values.cli_categoria_docente}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.cli_categoria_docente && formik.touched.cli_categoria_docente
										? "is-invalid" : "" )
									}>
							{RenderOptions(categoria_doc_opt)} 
						</select>
						<div>{(formik.errors.cli_categoria_docente) ? <p style={{color: 'red'}}>{formik.errors.cli_categoria_docente}</p> : null}</div>
					</div>					
					<div className="form-group mt-3" id="cli_categoria_cientifica">
						<label>Seleccione la categoría científica del cliente</label>
						<select
						  type="text"
						  name="cli_categoria_cientifica"
						  value={formik.values.cli_categoria_cientifica}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.cli_categoria_cientifica && formik.touched.cli_categoria_cientifica
										? "is-invalid" : "" )
									}>
							{RenderOptions(categoria_cient_opt)} 
						</select>
						<div>{(formik.errors.cli_categoria_cientifica) ? <p style={{color: 'red'}}>{formik.errors.cli_categoria_cientifica}</p> : null}</div>
					</div>
					<div className="form-group mt-3" id="cli_experiencia_practicas">			
						<label>Marque la opción correcta para la experiencia en prácticas profesionales del cliente</label>
						<br/>
						<label>Ha participado (Si): </label>
						<input
						  type="radio"
						  name="cli_experiencia_practicas"
						  value={true}
						  onChange={formik.getFieldProps("cli_experiencia_practicas").onChange}	  
						/>	
						<br/>
						<label>No ha participado (No): </label>
						<input
						  type="radio"
						  name="cli_experiencia_practicas"
						  value={false}
						  onChange={formik.getFieldProps("cli_experiencia_practicas").onChange}		  
						/>			
					</div>					
					<div className="form-group mt-3" id="cli_numero_est_atendidos">
						<label>Introduzca el número de estudiantes atendidos por el cliente</label>
						<input
						  type="text"
						  name="cli_numero_est_atendidos"
						  value={formik.values.cli_numero_est_atendidos}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.cli_numero_est_atendidos && formik.touched.cli_numero_est_atendidos
										? "is-invalid" : "" )}
						  placeholder="Número de estudiantes (valor entero, ej. 2)"
						/>					
						<div>{(formik.errors.cli_numero_est_atendidos) ? <p style={{color: 'red'}}>{formik.errors.cli_numero_est_atendidos}</p> : null}</div>
					</div>					
					<div className="d-grid gap-2 mt-3">
					<button type="submit" className="btn btn-success">
							Modificar datos
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