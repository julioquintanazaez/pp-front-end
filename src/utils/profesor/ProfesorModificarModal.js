import React, {useState, useEffect, useContext} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { BiBox } from 'react-icons/bi';   

export default function ProfesorModificarModal( props ) {
	
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
								{ value: "Divorciado", label: "Divorciado" }
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
							
	const modificarProfesor = async () => {
		
		await axios({
			method: 'put',
			url: "/actualizar_profesor/" + props.profesor.id_profesor,
			data: {
				prf_genero : formik.values.prf_genero,
				prf_estado_civil : formik.values.prf_estado_civil,  
				prf_numero_empleos : formik.values.prf_numero_empleos,
				prf_hijos : formik.values.prf_hijos,
				prf_pos_tecnica_trabajo : formik.values.prf_pos_tecnica_trabajo,
				prf_pos_tecnica_hogar : formik.values.prf_pos_tecnica_hogar,
				prf_cargo : formik.values.prf_cargo,
				prf_trab_remoto : formik.values.prf_trab_remoto,
				prf_categoria_docente : formik.values.prf_categoria_docente, 
				prf_categoria_cientifica : formik.values.prf_categoria_cientifica,  
				prf_experiencia_practicas : formik.values.prf_experiencia_practicas, 
				prf_numero_est_atendidos : formik.values.prf_numero_est_atendidos			
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Profesor actualizado"+ Math.random());
				Swal.fire("Profesor actualizado exitosamente", "", "success");
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
		if (props.profesor.id_profesor != null){	
			setShow(true);  
		}else{
			Swal.fire("No se ha seleccionado Profesor", props.profesor.id_profesor, "error");
		}
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		prf_genero: Yup.string().trim()
			.required("Se requiere el género del profesor"),
		prf_estado_civil: Yup.string().trim()
			.required("Se requiere el estado civil del profesor"),
		prf_numero_empleos: Yup.number().positive()
			.min(1)
			.required("Se requiere el número de empleos del profesor"),
		prf_hijos: Yup.number().positive()
			.min(0)
			.required("Se requiere el número de hijos del profesor"),
		prf_pos_tecnica_trabajo: Yup.string().trim()
			.required("Se requiere la posibilidad técnica del trabajo del profesor"),
		prf_pos_tecnica_hogar: Yup.string().trim()
			.required("Se requiere la posibilidad técnica del hogar del profesor"),
		prf_cargo: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opción")
			.required("Se requiere marque una opción"),	
		prf_trab_remoto: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opción")
			.required("Se requiere marque una opción"),	
		prf_categoria_docente: Yup.string().trim()
			.required("Se requiere la caegoría docente del profesor"),
		prf_categoria_cientifica: Yup.string().trim()
			.required("Se requiere la caegoría científica del profesor"),
		prf_experiencia_practicas: Yup.string().trim()
			.required("Se requiere la experiencia en prácticas profesionales del profesor"),
		prf_experiencia_practicas: Yup.string().trim()
			.required("Se requiere la experiencia en prácticas profesionales del profesor"),
		prf_numero_est_atendidos: Yup.number().positive()
			.min(1)
			.required("Se requiere el número de estudiantes atendidos por el profesor")
	});
	
	const registerInitialValues = {
		prf_genero : props.profesor.prf_genero,
		prf_estado_civil : props.profesor.prf_estado_civil,  
		prf_numero_empleos : props.profesor.prf_numero_empleos,
		prf_hijos : props.profesor.prf_hijos,
		prf_pos_tecnica_trabajo : props.profesor.prf_pos_tecnica_trabajo,
		prf_pos_tecnica_hogar : props.profesor.prf_pos_tecnica_hogar,
		prf_cargo : props.profesor.prf_cargo,
		prf_trab_remoto : props.profesor.prf_trab_remoto,
		prf_categoria_docente : props.profesor.prf_categoria_docente, 
		prf_categoria_cientifica : props.profesor.prf_categoria_cientifica,  
		prf_experiencia_practicas : props.profesor.prf_experiencia_practicas, 
		prf_numero_est_atendidos : props.profesor.prf_numero_est_atendidos
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Save data...")
			console.log(values)
			modificarProfesor();
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
					Modificar {props.profesor.prf_nombre}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<form className="form-control" onSubmit={formik.handleSubmit}>
					<div className="form-group mt-3" id="prf_genero">
						<label>Seleccione el género para el profesor</label>
						<select
						  type="text"
						  name="prf_genero"
						  value={formik.values.prf_genero}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.prf_genero && formik.touched.prf_genero
										? "is-invalid" : "" )
									}>
							{RenderOptions(genero)} 
						</select>
						<div>{(formik.errors.prf_genero) ? <p style={{color: 'red'}}>{formik.errors.prf_genero}</p> : null}</div>
					</div>	
					<div className="form-group mt-3" id="prf_estado_civil">
						<label>Seleccione el estado civil para el profesor</label>
						<select
						  type="text"
						  name="prf_estado_civil"
						  value={formik.values.prf_estado_civil}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.prf_estado_civil && formik.touched.prf_estado_civil
										? "is-invalid" : "" )
									}>
							{RenderOptions(estado_civil_opt)} 
						</select>
						<div>{(formik.errors.prf_estado_civil) ? <p style={{color: 'red'}}>{formik.errors.prf_estado_civil}</p> : null}</div>
					</div>	
					<div className="form-group mt-3" id="prf_numero_empleos">
						<label>Introduzca el número de empleos del profesor</label>
						<input
						  type="text"
						  name="prf_numero_empleos"
						  value={formik.values.prf_numero_empleos}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.prf_numero_empleos && formik.touched.prf_numero_empleos
										? "is-invalid" : "" )}
						  placeholder="Número de empleos del profesor"
						/>					
						<div>{(formik.errors.prf_numero_empleos) ? <p style={{color: 'red'}}>{formik.errors.prf_numero_empleos}</p> : null}</div>
					</div>
					<div className="form-group mt-3" id="prf_hijos">			
						<label>Marque la opción correcta para hijos del profesor</label>
						<br/>
						<label>Tiene hijos (Si): </label>
						<input
						  type="radio"
						  name="prf_hijos"
						  value={true}
						  onChange={formik.getFieldProps("prf_hijos").onChange}		  
						/>	
						<br/>
						<label>No tiene hijos (No): </label>
						<input
						  type="radio"
						  name="prf_hijos"
						  value={false}
						  onChange={formik.getFieldProps("prf_hijos").onChange}	  
						/>			
					</div>	
					<div className="form-group mt-3" id="prf_pos_tecnica_trabajo">
						<label>Seleccione el nivel tecnológico para el trabajo del profesor</label>
						<select
						  type="text"
						  name="prf_pos_tecnica_trabajo"
						  value={formik.values.prf_pos_tecnica_trabajo}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.prf_pos_tecnica_trabajo && formik.touched.prf_pos_tecnica_trabajo
										? "is-invalid" : "" )
									}>
							{RenderOptions(nivel_tecno_options)} 
						</select>
						<div>{(formik.errors.prf_pos_tecnica_trabajo) ? <p style={{color: 'red'}}>{formik.errors.prf_pos_tecnica_trabajo}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="prf_pos_tecnica_hogar">
						<label>Seleccione el nivel tecnológico para el hogar del profesor</label>
						<select
						  type="text"
						  name="prf_pos_tecnica_hogar"
						  value={formik.values.prf_pos_tecnica_hogar}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.prf_pos_tecnica_hogar && formik.touched.prf_pos_tecnica_hogar
										? "is-invalid" : "" )
									}>
							{RenderOptions(nivel_tecno_options)} 
						</select>
						<div>{(formik.errors.prf_pos_tecnica_hogar) ? <p style={{color: 'red'}}>{formik.errors.prf_pos_tecnica_hogar}</p> : null}</div>
					</div>	
					<div className="form-group mt-3" id="prf_cargo">			
						<label>Marque la opción correcta para la ocupación de cargo del profesor</label>
						<br/>
						<label>Ocupa cargo (Si): </label>
						<input
						  type="radio"
						  name="prf_cargo"
						  value={true}
						  onChange={formik.getFieldProps("prf_cargo").onChange}	  
						/>	
						<br/>
						<label>No ocupa cargo (No): </label>
						<input
						  type="radio"
						  name="prf_cargo"
						  value={false}
						  onChange={formik.getFieldProps("prf_cargo").onChange}	  
						/>			
					</div>
					<div className="form-group mt-3" id="prf_trab_remoto">			
						<label>Marque la opción correcta para la posibilidad de trabajo remoto del profesor</label>
						<br/>
						<label>Puede trabajar remoto (Si): </label>
						<input
						  type="radio"
						  name="prf_trab_remoto"
						  value={true}
						  onChange={formik.getFieldProps("prf_trab_remoto").onChange}	  
						/>	
						<br/>
						<label>No puede trabajar remoto (No): </label>
						<input
						  type="radio"
						  name="prf_trab_remoto"
						  value={false}
						  onChange={formik.getFieldProps("prf_trab_remoto").onChange}		  
						/>			
					</div>		
					<div className="form-group mt-3" id="prf_categoria_docente">
						<label>Seleccione la categoría docente del profesor</label>
						<select
						  type="text"
						  name="prf_categoria_docente"
						  value={formik.values.prf_categoria_docente}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.prf_categoria_docente && formik.touched.prf_categoria_docente
										? "is-invalid" : "" )
									}>
							{RenderOptions(categoria_doc_opt)} 
						</select>
						<div>{(formik.errors.prf_categoria_docente) ? <p style={{color: 'red'}}>{formik.errors.prf_categoria_docente}</p> : null}</div>
					</div>					
					<div className="form-group mt-3" id="prf_categoria_cientifica">
						<label>Seleccione la categoría científica del profesor</label>
						<select
						  type="text"
						  name="prf_categoria_cientifica"
						  value={formik.values.prf_categoria_cientifica}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.prf_categoria_cientifica && formik.touched.prf_categoria_cientifica
										? "is-invalid" : "" )
									}>
							{RenderOptions(categoria_cient_opt)} 
						</select>
						<div>{(formik.errors.prf_categoria_cientifica) ? <p style={{color: 'red'}}>{formik.errors.prf_categoria_cientifica}</p> : null}</div>
					</div>
					<div className="form-group mt-3" id="prf_experiencia_practicas">			
						<label>Marque la opción correcta para la experiencia en prácticas profesionales del profesor</label>
						<br/>
						<label>Ha participado (Si): </label>
						<input
						  type="radio"
						  name="prf_experiencia_practicas"
						  value={true}
						  onChange={formik.getFieldProps("prf_experiencia_practicas").onChange}	  
						/>	
						<br/>
						<label>No ha participado (No): </label>
						<input
						  type="radio"
						  name="prf_experiencia_practicas"
						  value={false}
						  onChange={formik.getFieldProps("prf_experiencia_practicas").onChange}		  
						/>			
					</div>					
					<div className="form-group mt-3" id="prf_numero_est_atendidos">
						<label>Introduzca el número de estudiantes atendidos por el profesor</label>
						<input
						  type="text"
						  name="prf_numero_est_atendidos"
						  value={formik.values.prf_numero_est_atendidos}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.prf_numero_est_atendidos && formik.touched.prf_numero_est_atendidos
										? "is-invalid" : "" )}
						  placeholder="Número de estudiantes (valor entero, ej. 2)"
						/>					
						<div>{(formik.errors.prf_numero_est_atendidos) ? <p style={{color: 'red'}}>{formik.errors.prf_numero_est_atendidos}</p> : null}</div>
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