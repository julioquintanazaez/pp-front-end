import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect, useContext} from "react";
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";

export default function EstudianteAdicionar ( ) {
	
	const [validated, setValidated] = useState(false);
	const {messages, setMessages, token } = useContext(Context);
	const [entidadescontexto, setEntidadesContexto] = useState([]);
	const [usuarios, setUsuarios] = useState([]);
	
	//Options configurations
	const nivel_tecno_options = [
								{ value: "Ninguna", label: "Ninguna" },
								{ value: "Basica", label: "Basica" },
								{ value: "Media", label: "Media" },
								{ value: "Alta", label: "Alta" }
							];	
							
	const por_econom_options = [
								{ value: "Baja", label: "Baja" },
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
	
	const adicionarEstudiante = async () => {
		
		await axios({
			method: 'post',
			url: '/crear_estudiante/',
			data: {
				est_genero : formik.values.est_genero,
				est_estado_civil : formik.values.est_estado_civil,  
				est_trabajo : formik.values.est_trabajo,
				est_becado : formik.values.est_becado,
				est_hijos : formik.values.est_hijos,
				est_posibilidad_economica : formik.values.est_posibilidad_economica,
				est_pos_tecnica_escuela : formik.values.est_pos_tecnica_escuela,
				est_pos_tecnica_hogar : formik.values.est_pos_tecnica_hogar,
				est_trab_remoto : formik.values.est_trab_remoto,
				est_universidad_id : formik.values.est_universidad_id,	
				user_estudiante_id : formik.values.user_estudiante_id
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Estudiante creado"+ Math.random());
				Swal.fire("Estudiante creado exitosamente", "", "success");
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
		});				  
	}
  
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		est_genero: Yup.string().trim()
			.required("Se requiere el g�nero del estudiante"),
		est_estado_civil: Yup.string().trim()
			.required("Se requiere el estado civil del estudiante"),
		est_trabajo: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opci�n")
			.required("Se requiere marque una opci�n"),	
		est_becado: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opci�n")
			.required("Se requiere marque una opci�n"),	
		est_hijos: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opci�n")
			.required("Se requiere seleccione la opci�n de hijos del estudiante"),
		est_posibilidad_economica: Yup.string().trim()
			.required("Se requiere la posibilidad econ�omica del del estudiante"),
		est_pos_tecnica_escuela: Yup.string().trim()
			.required("Se requiere la posibilidad t�cnica del trabajo del estudiante"),
		est_pos_tecnica_hogar: Yup.string().trim()
			.required("Se requiere la posibilidad t�cnica del hogar del estudiante"),
		est_trab_remoto: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opci�n")
			.required("Se requiere marque una opci�n"),	
		est_entidad_id: Yup.string().trim()
			.required("Se requiere el centro de pertenencia del estudiante"),
		user_estudiante_id: Yup.string().trim()
			.required("Se requiere seleccionar un estudiante"),
	});
	
	const registerInitialValues = {
		est_genero : genero[0]["value"],
		est_estado_civil : estado_civil_opt[0]["value"],
		est_trabajo : false,
		est_becado : false,
		est_hijos : false,
		est_posibilidad_economica : por_econom_options[0]["value"],
		est_pos_tecnica_escuela : nivel_tecno_options[0]["value"],
		est_pos_tecnica_hogar : nivel_tecno_options[0]["value"],
		est_trab_remoto : false,
		est_entidad_id : "",
		user_estudiante_id : ""
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Guardar datos...")
			console.log(values)
			adicionarEstudiante();
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
		leerUsuariosParaEstudiantes();
    }, [messages]);	
	
	const leerUsuariosParaEstudiantes = async () => {
		
		await axios({
			method: 'get',
			url: '/leer_estudiantes_no_activos/',
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
				<div className="form-group mt-3" id="user_estudiante_id">
					<label>Seleccione un estudiante para trabajar en las pr�cticas laborales</label>
					<select
					  type="text"
					  name="user_estudiante_id"
					  value={formik.values.user_estudiante_id}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.user_estudiante_id && formik.touched.user_estudiante_id
									? "is-invalid" : "" )
								}>
						{RenderUsuarios()}
					<option value="" label="Seleccione un estudiante">Seleccione una opcion</option>	
					</select>
					<div>{(formik.errors.user_estudiante_id) ? <p style={{color: 'red'}}>{formik.errors.user_estudiante_id}</p> : null}</div>
				</div>		
				<div className="form-group mt-3" id="est_genero">
					<label>Seleccione el g�nero para el estudiante</label>
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
					<label>Marque la opci�n correcta para la beca del estudiante</label>
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
					<label>Marque la opci�n correcta para el trabajo del estudiante</label>
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
					<label>Marque la opci�n correcta para hijos del estudiante</label>
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
					<label>Seleccione el nivel tecnol�gico para el trabajo del estudiante</label>
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
					<label>Seleccione el nivel tecnol�gico para el centro de estudios del estudiante</label>
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
					<label>Seleccione el nivel tecnol�gico para el hogar del estudiante</label>
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
					<label>Marque la opci�n correcta para la posibilidad de trabajo remoto del estudiante</label>
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
				<div className="form-group mt-3" id="est_entidad_id">
					<label>Seleccione la entidad de origen del estudiante</label>
					<select
					  type="text"
					  name="est_entidad_id"
					  value={formik.values.est_entidad_id}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.est_entidad_id && formik.touched.est_entidad_id
									? "is-invalid" : "" )
								}>
						<option value="" label="Seleccione una opcion">Seleccione una opcion</option>	
						{ RenderEntidadOrigen(entidadescontexto) } 
					</select>
					<div>{(formik.errors.est_entidad_id) ? <p style={{color: 'red'}}>{formik.errors.est_entidad_id}</p> : null}</div>
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