import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect, useContext} from "react";
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";

//import { EntidadesOrigenProvider } from './../origen/EntidadesOrigenProvider';

export default function ProfesorAdicionar ( ) {
	
	const [validated, setValidated] = useState(false);
	const {messages , setMessages, token } = useContext(Context);
	const [entidadescontexto, setEntidadesContexto] = useState([]);
	const [usuarios, setUsuarios] = useState([]);
	
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
	
	const adicionarProfesor = async () => {
		
		await axios({
			method: 'post',
			url: '/crear_profesor/',
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
				prf_numero_est_atendidos : formik.values.prf_numero_est_atendidos,  
				prf_universidad_id : formik.values.prf_universidad_id,
				user_profesor_id : formik.values.user_profesor_id
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Profesor creado"+ Math.random());
				Swal.fire("Profesor creado exitosamente", "", "success");
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
		});				  
	}
  
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		prf_genero: Yup.string().trim()
			.required("Se requiere el g�nero del profesor"),
		prf_estado_civil: Yup.string().trim()
			.required("Se requiere el estado civil del profesor"),
		prf_numero_empleos: Yup.number().positive()
			.min(1)
			.required("Se requiere el n�mero de empleos del profesor"),
		prf_hijos: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opci�n")
			.required("Se requiere marque una opci�n"),	
		prf_pos_tecnica_trabajo: Yup.string().trim()
			.required("Se requiere la posibilidad t�cnica del trabajo del profesor"),
		prf_pos_tecnica_hogar: Yup.string().trim()
			.required("Se requiere la posibilidad t�cnica del hogar del profesor"),
		prf_cargo: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opci�n")
			.required("Se requiere marque una opci�n"),	
		prf_trab_remoto: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opci�n")
			.required("Se requiere marque una opci�n"),	
		prf_categoria_docente: Yup.string().trim()
			.required("Se requiere la caegor�a docente del profesor"),
		prf_categoria_cientifica: Yup.string().trim()
			.required("Se requiere la caegor�a cient�fica del profesor"),
		prf_experiencia_practicas: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opci�n")
			.required("Se requiere marque una opci�n"),
		prf_numero_est_atendidos: Yup.number().positive()
			.min(1)
			.required("Se requiere el n�mero de estudiantes atendidos por el profesor"),
		prf_universidad_id: Yup.string().trim()
			.required("Se requiere el centro de pertenencia del profesor"),
		user_profesor_id: Yup.string().trim()
			.required("Se requiere seleccione un profesor")	
	});
	
	const registerInitialValues = {
		prf_genero : genero[0]["value"],
		prf_estado_civil : estado_civil_opt[0]["value"],  
		prf_numero_empleos : 1,
		prf_hijos : false,
		prf_pos_tecnica_trabajo : nivel_tecno_options[0]["value"],
		prf_pos_tecnica_hogar : nivel_tecno_options[0]["value"],
		prf_cargo : false,
		prf_trab_remoto : false,
		prf_categoria_docente : categoria_doc_opt[0]["value"], 
		prf_categoria_cientifica : categoria_cient_opt[0]["value"],  
		prf_experiencia_practicas : false, 
		prf_numero_est_atendidos : 1,  
		prf_universidad_id : "",
		user_profesor_id: ""
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Guardar datos...")
			adicionarProfesor();
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
        leerEntidades();
    }, []);	
	
	const leerEntidades = async () => {
		
		await axios({
			method: 'get',
			url: '/leer_entidades_origen/',			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {	
				setEntidadesContexto(response.data);
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});				  
	}
	
	const RenderEntidadOrigen = (entidadescontexto) => {
		return (			
			entidadescontexto.map(item => 
				<option value={item.id_entidad_origen} label={item.org_siglas}>{item.org_siglas}</option>				
			) 
		)
	};	
	
	useEffect(()=> {
		leerUsuariosParaProfesores();
    }, [messages]);	
	
	const leerUsuariosParaProfesores = async () => {
		
		await axios({
			method: 'get',
			url: '/leer_profesores_no_activos/',
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setUsuarios(response.data);				
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
		});				  
	}
	
	const RenderUsuarios = () => {
		return (			
			usuarios.map(item => 
				<option value={item.id} label={item.nombre + " " + item.primer_appellido + " " + item.segundo_appellido}>
					{item.nombre + " " + item.primer_appellido + " " + item.segundo_appellido}
				</option>				
			) 
		)
	};	
	
	return (
		<>
			<form className="form-control" onSubmit={formik.handleSubmit}>
				<div className="form-group mt-3" id="user_profesor_id">
					<label>Seleccione un profesor para trabajar en las pr�cticas laborales</label>
					<select
					  type="text"
					  name="user_profesor_id"
					  value={formik.values.user_profesor_id}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.user_profesor_id && formik.touched.user_profesor_id
									? "is-invalid" : "" )
								}>
						<option value="" label="Seleccione un profesor">Seleccione una opcion</option>	
						{RenderUsuarios()}					
					</select>
					<div>{(formik.errors.user_profesor_id) ? <p style={{color: 'red'}}>{formik.errors.user_profesor_id}</p> : null}</div>
				</div>	
				<div className="form-group mt-3" id="prf_universidad_id">
					<label>Seleccione la entidad de origen del profesor</label>
					<select
					  type="text"
					  name="prf_universidad_id"
					  value={formik.values.prf_universidad_id}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.prf_universidad_id && formik.touched.prf_universidad_id
									? "is-invalid" : "" )
								}>
						<option value="" label="Seleccione una opcion">Seleccione una opcion</option>	
						{ RenderEntidadOrigen(entidadescontexto) } 
					</select>
					<div>{(formik.errors.prf_universidad_id) ? <p style={{color: 'red'}}>{formik.errors.prf_universidad_id}</p> : null}</div>
				</div>		
				<div className="form-group mt-3" id="prf_genero">
					<label>Seleccione el g�nero para el profesor</label>
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
					<label>Introduzca el n�mero de empleos del profesor</label>
					<input
					  type="text"
					  name="prf_numero_empleos"
					  value={formik.values.prf_numero_empleos}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.prf_numero_empleos && formik.touched.prf_numero_empleos
									? "is-invalid" : "" )}
					  placeholder="N�mero de empleos del profesor"
					/>					
					<div>{(formik.errors.prf_numero_empleos) ? <p style={{color: 'red'}}>{formik.errors.prf_numero_empleos}</p> : null}</div>
				</div>
				<div className="form-group mt-3" id="prf_hijos">			
					<label>Marque la opci�n correcta para hijos del profesor</label>
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
					<label>Seleccione el nivel tecnol�gico para el trabajo del profesor</label>
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
					<label>Seleccione el nivel tecnol�gico para el hogar del profesor</label>
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
					<label>Marque la opci�n correcta para la ocupaci�n de cargo del profesor</label>
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
					<label>Marque la opci�n correcta para la posibilidad de trabajo remoto del profesor</label>
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
					<label>Seleccione la categor�a docente del profesor</label>
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
					<label>Seleccione la categor�a cient�fica del profesor</label>
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
					<label>Marque la opci�n correcta para la experiencia en pr�cticas profesionales del profesor</label>
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
					<label>Introduzca el n�mero de estudiantes atendidos por el profesor</label>
					<input
					  type="text"
					  name="prf_numero_est_atendidos"
					  value={formik.values.prf_numero_est_atendidos}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.prf_numero_est_atendidos && formik.touched.prf_numero_est_atendidos
									? "is-invalid" : "" )}
					  placeholder="N�mero de estudiantes (valor entero, ej. 2)"
					/>					
					<div>{(formik.errors.prf_numero_est_atendidos) ? <p style={{color: 'red'}}>{formik.errors.prf_numero_est_atendidos}</p> : null}</div>
				</div>									
				<div className="d-grid gap-2 mt-3">
					<button type="submit" className="btn btn-success">
							Guardar datos
					</button>					
				</div>		
			</form>
		</>
	);
}