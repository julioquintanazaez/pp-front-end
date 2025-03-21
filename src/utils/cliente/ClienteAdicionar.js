import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect, useContext} from "react";
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";

export default function ClienteAdicionar ( ) {
	
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
	
	const categoria_doc_opt = [
								{ value: "Instructor", label: "Instructor" },
								{ value: "Auxiliar", label: "Auxiliar" },
								{ value: "Asistente", label: "Asistente" },
								{ value: "Titular", label: "Titular" }
							];	
							
	const categoria_cient_opt = [
								{ value: "Tecnico", label: "Técnico" },
								{ value: "Ingeniero", label: "Ingeniero" },
								{ value: "Licenciado", label: "Licenciado" },
								{ value: "Master", label: "Master" },
								{ value: "Doctor", label: "Doctor" }
							];	
	
	const adicionarCliente = async () => {
		
		await axios({
			method: 'post',
			url: '/crear_cliente/',
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
				cli_numero_est_atendidos : formik.values.cli_numero_est_atendidos,  
				cli_entidad_id : formik.values.cli_entidad_id,	
				user_cliente_id : formik.values.user_cliente_id
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Cliente creado"+ Math.random());
				Swal.fire("Cliente creado exitosamente", "", "success");
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
		});				  
	}
  
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		cli_genero: Yup.string().trim()
			.required("Se requiere el g�nero del cliente"),
		cli_estado_civil: Yup.string().trim()
			.required("Se requiere el estado civil del cliente"),
		cli_numero_empleos: Yup.number().positive()
			.min(1)
			.required("Se requiere el n�mero de empleos del cliente"),
		cli_hijos: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opci�n")
			.required("Se requiere el n�mero de hijos del cliente"),
		cli_pos_tecnica_trabajo: Yup.string().trim()
			.required("Se requiere la posibilidad t�cnica del trabajo del cliente"),
		cli_pos_tecnica_hogar: Yup.string().trim()
			.required("Se requiere la posibilidad t�cnica del hogar del cliente"),
		cli_cargo: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opci�n")
			.required("Se requiere marque una opci�n"),	
		cli_trab_remoto: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opci�n")
			.required("Se requiere marque una opci�n"),	
		cli_categoria_docente: Yup.string().trim()
			.required("Se requiere la caegor�a docente del cliente"),
		cli_categoria_cientifica: Yup.string().trim()
			.required("Se requiere la caegor�a cient�fica del cliente"),
		cli_experiencia_practicas: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opci�n")
			.required("Se requiere marque una opci�n"),	
		cli_numero_est_atendidos: Yup.number().positive()
			.min(1)
			.required("Se requiere el n�mero de estudiantes atendidos por el cliente"),
		cli_entidad_id: Yup.string().trim()
			.required("Se requiere el centro de pertenencia del cliente"),
		user_cliente_id: Yup.string().trim()
			.required("Se requiere seleccione un cliente")
	});
	
	const registerInitialValues = {
		cli_genero : genero[0]["value"],
		cli_estado_civil : estado_civil_opt[0]["value"],  
		cli_numero_empleos : 1,
		cli_hijos : false,
		cli_pos_tecnica_trabajo : nivel_tecno_options[0]["value"],
		cli_pos_tecnica_hogar : nivel_tecno_options[0]["value"],
		cli_cargo : false,
		cli_trab_remoto : false,
		cli_categoria_docente : categoria_doc_opt[0]["value"], 
		cli_categoria_cientifica : categoria_cient_opt[0]["value"],  
		cli_experiencia_practicas : false, 
		cli_numero_est_atendidos : 1,  
		cli_entidad_id : "",
		user_cliente_id: ""
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Guardar datos...")
			console.log(values)
			adicionarCliente();
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
			url: '/leer_entidades_destino/',			
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
				<option value={item.id_entidad_destino} label={item.dest_siglas}>{item.dest_siglas}</option>				
			) 
		)
	};	
	
	useEffect(()=> {
		leerUsuariosParaProfesores();
    }, [messages]);	
	
	const leerUsuariosParaProfesores = async () => {
		
		await axios({
			method: 'get',
			url: '/leer_clientes_no_activos/',
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
				<div className="form-group mt-3" id="user_cliente_id">
					<label>Seleccione un cliente para trabajar en las pr�cticas laborales</label>
					<select
					  type="text"
					  name="user_cliente_id"
					  value={formik.values.user_cliente_id}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.user_cliente_id && formik.touched.user_cliente_id
									? "is-invalid" : "" )
								}>
						{RenderUsuarios()}
					<option value="" label="Seleccione un cliente">Seleccione una opcion</option>	
					</select>
					<div>{(formik.errors.user_cliente_id) ? <p style={{color: 'red'}}>{formik.errors.user_cliente_id}</p> : null}</div>
				</div>		
				<div className="form-group mt-3" id="cli_genero">
					<label>Seleccione el g�nero para el cliente</label>
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
					<label>Introduzca el n�mero de empleos del cliente</label>
					<input
					  type="text"
					  name="cli_numero_empleos"
					  value={formik.values.cli_numero_empleos}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.cli_numero_empleos && formik.touched.cli_numero_empleos
									? "is-invalid" : "" )}
					  placeholder="N�mero de empleos del cliente"
					/>					
					<div>{(formik.errors.cli_numero_empleos) ? <p style={{color: 'red'}}>{formik.errors.cli_numero_empleos}</p> : null}</div>
				</div>
				<div className="form-group mt-3" id="cli_hijos">			
					<label>Marque la opci�n correcta para hijos del cliente</label>
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
					<label>Seleccione el nivel tecnol�gico para el trabajo del cliente</label>
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
					<label>Seleccione el nivel tecnol�gico para el hogar del cliente</label>
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
					<label>Marque la opci�n correcta para la ocupaci�n de cargo del cliente</label>
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
					<label>Marque la opci�n correcta para la posibilidad de trabajo remoto del cliente</label>
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
					<label>Seleccione la categor�a docente del cliente</label>
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
					<label>Seleccione la categor�a cient�fica del cliente</label>
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
					<label>Marque la opci�n correcta para la experiencia en pr�cticas profesionales del cliente</label>
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
					<label>Introduzca el n�mero de estudiantes atendidos por el cliente</label>
					<input
					  type="text"
					  name="cli_numero_est_atendidos"
					  value={formik.values.cli_numero_est_atendidos}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.cli_numero_est_atendidos && formik.touched.cli_numero_est_atendidos
									? "is-invalid" : "" )}
					  placeholder="N�mero de estudiantes (valor entero, ej. 2)"
					/>					
					<div>{(formik.errors.cli_numero_est_atendidos) ? <p style={{color: 'red'}}>{formik.errors.cli_numero_est_atendidos}</p> : null}</div>
				</div>					
				<div className="form-group mt-3" id="cli_entidad_id">
					<label>Seleccione la entidad de origen del cliente</label>
					<select
					  type="text"
					  name="cli_entidad_id"
					  value={formik.values.cli_entidad_id}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.cli_entidad_id && formik.touched.cli_entidad_id
									? "is-invalid" : "" )
								}>
						<option value="" label="Seleccione una opcion">Seleccione una opcion</option>	
						{ RenderEntidadOrigen(entidadescontexto) } 
					</select>
					<div>{(formik.errors.cli_entidad_id) ? <p style={{color: 'red'}}>{formik.errors.cli_entidad_id}</p> : null}</div>
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