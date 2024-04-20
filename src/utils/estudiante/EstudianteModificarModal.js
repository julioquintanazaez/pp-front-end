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



export default function estudianteModificarModal( props ) {
	
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

	const por_econom_options = [
								{ value: "Bajo", label: "Bajo" },
								{ value: "Medio", label: "Medio" },
								{ value: "Alto", label: "Alto" }
							];	
							
	const genero = [
					{ value: "M", label: "M" },
					{ value: "F", label: "F" }
				];	
	
	const estado_civil_opt = [
								{ value: "Soltero", label: "Soltero" },
								{ value: "Casado", label: "Casado" },
								{ value: "Divorciado", label: "Divorciado" },
								{ value: "Viudo", label: "Viudo" }
							];	
		
	
	const modificarEstudiante = async () => {
		
		await axios({
			method: 'put',
			url: "/actualizar_estudiante/" + props.estudiante.id_estudiante,
			data: {
				est_genero : formik.values.est_genero,
				est_estado_civil : formik.values.est_estado_civil,  
				est_trabajo : formik.values.est_trabajo,
				est_becado : formik.values.est_becado,
				est_hijos : formik.values.est_hijos,
				est_posibilidad_economica : formik.values.est_posibilidad_economica,
				est_pos_tecnica_escuela : formik.values.est_pos_tecnica_escuela,
				est_pos_tecnica_hogar : formik.values.est_pos_tecnica_hogar,
				est_trab_remoto : formik.values.est_trab_remoto						
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Estudiante actualizado"+ Math.random());
				Swal.fire("Estudiante actualizado exitosamente", "", "success");
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
		if (props.estudiante.id_estudiante != null){	
			setShow(true);  
		}else{
			Swal.fire("No se ha seleccionado estudiante", props.estudiante.id_estudiante, "error");
		}
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		est_genero: Yup.string().trim()
			.required("Se requiere el género del estudiante"),
		est_estado_civil: Yup.string().trim()
			.required("Se requiere el estado civil del estudiante"),
		est_trabajo: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opción")
			.required("Se requiere marque una opción"),	
		est_becado: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opción")
			.required("Se requiere marque una opción"),	
		est_hijos: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opción")
			.required("Se requiere seleccione la opción de hijos del estudiante"),
		est_posibilidad_economica: Yup.string().trim()
			.required("Se requiere la posibilidad econñomica del del estudiante"),
		est_pos_tecnica_escuela: Yup.string().trim()
			.required("Se requiere la posibilidad técnica del trabajo del estudiante"),
		est_pos_tecnica_hogar: Yup.string().trim()
			.required("Se requiere la posibilidad técnica del hogar del estudiante"),
		est_trab_remoto: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opción")
			.required("Se requiere marque una opción")
	});
	
	const registerInitialValues = {
		est_genero : props.estudiante.est_genero,
		est_estado_civil : props.estudiante.est_estado_civil, 
		est_trabajo : props.estudiante.est_trabajo,		
		est_becado : props.estudiante.est_becado,
		est_hijos : props.estudiante.est_hijos,
		est_posibilidad_economica : props.estudiante.est_posibilidad_economica,
		est_pos_tecnica_escuela : props.estudiante.est_pos_tecnica_escuela,
		est_pos_tecnica_hogar : props.estudiante.est_pos_tecnica_hogar,
		est_trab_remoto : props.estudiante.est_trab_remoto
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Save data...")
			console.log(values)
			modificarEstudiante();
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
					Modificar {props.estudiante.est_nombre} {props.estudiante.est_primer_appellido} {props.estudiante.est_segundo_appellido}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<form className="form-control" onSubmit={formik.handleSubmit}>
					<div className="form-group mt-3" id="est_genero">
						<label>Seleccione el género para el estudiante</label>
						<select
						  type="text"
						  name="est_genero"
						  value={formik.values.est_genero}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.est_genero && formik.touched.est_genero
										? "is-invalid" : "" )
									}>
							{RenderOptions(genero)} 
						</select>
						<div>{(formik.errors.est_genero) ? <p style={{color: 'red'}}>{formik.errors.est_genero}</p> : null}</div>
					</div>	
					<div className="form-group mt-3" id="est_estado_civil">
						<label>Seleccione el estado civil para el estudiante</label>
						<select
						  type="text"
						  name="est_estado_civil"
						  value={formik.values.est_estado_civil}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.est_estado_civil && formik.touched.est_estado_civil
										? "is-invalid" : "" )
									}>
							{RenderOptions(estado_civil_opt)} 
						</select>
						<div>{(formik.errors.est_estado_civil) ? <p style={{color: 'red'}}>{formik.errors.est_estado_civil}</p> : null}</div>
					</div>	
					<div className="form-group mt-3" id="est_becado">			
						<label>Marque la opción correcta para la beca del estudiante</label>
						<br/>
						<label>Es becado (Si): </label>
						<input
						  type="radio"
						  name="est_becado"
						  value={true}
						  onChange={formik.getFieldProps("est_becado").onChange}		  
						/>	
						<br/>
						<label>No es becado (No): </label>
						<input
						  type="radio"
						  name="est_becado"
						  value={false}
						  onChange={formik.getFieldProps("est_becado").onChange}	  
						/>			
					</div>	
					<div className="form-group mt-3" id="est_trabajo">			
						<label>Marque la opción correcta para el trabajo del estudiante</label>
						<br/>
						<label>Trabaja (Si): </label>
						<input
						  type="radio"
						  name="est_trabajo"
						  value={true}
						  onChange={formik.getFieldProps("est_trabajo").onChange}		  
						/>	
						<br/>
						<label>No trabaja (No): </label>
						<input
						  type="radio"
						  name="est_trabajo"
						  value={false}
						  onChange={formik.getFieldProps("est_trabajo").onChange}	  
						/>			
					</div>	
					<div className="form-group mt-3" id="est_hijos">			
						<label>Marque la opción correcta para hijos del estudiante</label>
						<br/>
						<label>Tiene hijos (Si): </label>
						<input
						  type="radio"
						  name="est_hijos"
						  value={true}
						  onChange={formik.getFieldProps("est_hijos").onChange}		  
						/>	
						<br/>
						<label>No tiene hijos (No): </label>
						<input
						  type="radio"
						  name="est_hijos"
						  value={false}
						  onChange={formik.getFieldProps("est_hijos").onChange}	  
						/>			
					</div>	
					<div className="form-group mt-3" id="est_posibilidad_economica">
						<label>Seleccione el nivel tecnológico para el trabajo del estudiante</label>
						<select
						  type="text"
						  name="est_posibilidad_economica"
						  value={formik.values.est_posibilidad_economica}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.est_posibilidad_economica && formik.touched.est_posibilidad_economica
										? "is-invalid" : "" )
									}>
							{RenderOptions(por_econom_options)} 
						</select>
						<div>{(formik.errors.est_posibilidad_economica) ? <p style={{color: 'red'}}>{formik.errors.est_posibilidad_economica}</p> : null}</div>
					</div>	
					<div className="form-group mt-3" id="est_pos_tecnica_escuela">
						<label>Seleccione el nivel tecnológico para el centro de estudios del estudiante</label>
						<select
						  type="text"
						  name="est_pos_tecnica_escuela"
						  value={formik.values.est_pos_tecnica_escuela}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.est_pos_tecnica_escuela && formik.touched.est_pos_tecnica_escuela
										? "is-invalid" : "" )
									}>
							{RenderOptions(nivel_tecno_options)} 
						</select>
						<div>{(formik.errors.est_pos_tecnica_escuela) ? <p style={{color: 'red'}}>{formik.errors.est_pos_tecnica_escuela}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="est_pos_tecnica_hogar">
						<label>Seleccione el nivel tecnológico para el hogar del estudiante</label>
						<select
						  type="text"
						  name="est_pos_tecnica_hogar"
						  value={formik.values.est_pos_tecnica_hogar}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.est_pos_tecnica_hogar && formik.touched.est_pos_tecnica_hogar
										? "is-invalid" : "" )
									}>
							{RenderOptions(nivel_tecno_options)} 
						</select>
						<div>{(formik.errors.est_pos_tecnica_hogar) ? <p style={{color: 'red'}}>{formik.errors.est_pos_tecnica_hogar}</p> : null}</div>
					</div>	
					<div className="form-group mt-3" id="est_trab_remoto">			
						<label>Marque la opción correcta para la posibilidad de trabajo remoto del estudiante</label>
						<br/>
						<label>Puede trabajar remoto (Si): </label>
						<input
						  type="radio"
						  name="est_trab_remoto"
						  value={true}
						  onChange={formik.getFieldProps("est_trab_remoto").onChange}	  
						/>	
						<br/>
						<label>No puede trabajar remoto (No): </label>
						<input
						  type="radio"
						  name="est_trab_remoto"
						  value={false}
						  onChange={formik.getFieldProps("est_trab_remoto").onChange}		  
						/>			
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