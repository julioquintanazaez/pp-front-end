import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect, useContext} from "react";
import { Context } from '../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function AsignacionAdicionar ( ) {
	
	const [validated, setValidated] = useState(false);
	const { setMessages, token } = useContext(Context);
	const [tipotareas, setTipoTareas] = useState([]);
	const [estudiantes, setEstudiantes] = useState([]);
	const [concertaciones, setConcertaciones] = useState([]);
	
	//Options configurations
	const complejidad_options = [
								{ value: "Baja", label: "Baja" },
								{ value: "Media", label: "Media" },
								{ value: "Alta", label: "Alta" }
							];			

    const formatDate = (date) => {		
		return date.toISOString().split('T')[0]
	};				
	
	const adicionarAsignacion = async () => {
		
		await axios({
			method: 'post',
			url: '/crear_asignacion_tarea/',
			data: {
				asg_descripcion : formik.values.asg_descripcion,
				asg_fecha_inicio : formatDate(formik.values.asg_fecha_inicio),
				asg_fecha_fin : formatDate(formik.values.asg_fecha_fin),
				asg_complejidad_estimada : formik.values.asg_complejidad_estimada,
				asg_participantes : formik.values.asg_participantes,
				asg_tipo_tarea_id : formik.values.asg_tipo_tarea_id,
				asg_estudiante_id : formik.values.asg_estudiante_id,  
				asg_conc_id : formik.values.asg_conc_id							
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Asignacion creada"+ Math.random());
				Swal.fire("Asignacion creada exitosamente", "", "success");
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
		});				  
	}
  
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		asg_descripcion: Yup.string().trim()
			.required("Se requiere el tema para la asignaci�n"),
		asg_fecha_inicio: Yup.date()
			.required("Se requiere la fecha de inicio para la asignaci�n"),
		asg_fecha_fin: Yup.date()
			.required("Se requiere la fecha de fin para la asignaci�n")
			.min(Yup.ref("asg_fecha_inicio"), "La fecha de fin debe ser superior a la de inicio"),
		asg_complejidad_estimada: Yup.string().trim()
			.required("Se requiere lacomplejidad para la asignaci�n"),
		asg_participantes: Yup.number().positive()
			.required("Se requiere el numro de participantes para el desarrollo de la asignaci�n"),
		asg_tipo_tarea_id: Yup.string().trim()
			.required("Se requiere el tipo de actividad para la asignaci�n"),
		asg_estudiante_id: Yup.string().trim()
			.required("Se requiere el estudiante encargado para la asignaci�n"),
		asg_conc_id: Yup.string().trim()
			.required("Se requiere la concertaci�n madre para la asignaci�n")		
	});
	
	const registerInitialValues = {
		asg_descripcion : "",
		asg_fecha_inicio : new Date(),
		asg_fecha_fin : new Date(),
		asg_complejidad_estimada : complejidad_options[0]["value"],
		asg_participantes : 1,
		asg_tipo_tarea_id : "",
		asg_estudiante_id : "",  
		asg_conc_id : ""			
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Guardar datos...")
			console.log(values)
			adicionarAsignacion();
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
        leerTareas();
		leerEstudiantes();
		leerConcertaciones();
    }, []);	
	
	const leerTareas = async () => {
		
		await axios({
			method: 'get',
			url: '/leer_tipos_tareas/',			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {	
				setTipoTareas(response.data);
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});				  
	};
	
	const RenderTipoTareas = () => {
		return (			
			tipotareas.map(item => 
				<option value={item.id_tipo_tarea} label={item.tarea_tipo_nombre}>
					{item.tarea_tipo_nombre} 
				</option>				
			) 
		)
	};	
	
	const leerEstudiantes = async () => {
		
		await axios({
			method: 'get',
			url: '/leer_estudiantes/',			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {	
				setEstudiantes(response.data);
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});				  
	};
	
	const RenderEstudiantes = () => {
		return (			
			estudiantes.map(item => 
				<option value={item.id_estudiante} label={item.nombre + " " + item.primer_appellido + " " + item.segundo_appellido}>
					{item.nombre + " " + item.primer_appellido + " " + item.segundo_appellido}
				</option>				
			) 
		)
	};	
	
	const leerConcertaciones = async () => {
		
		await axios({
			method: 'get',
			url: '/leer_concertacion_simple/',			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {	
				setConcertaciones(response.data);
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});				  
	};
	
	const RenderConcertaciones = () => {
		return (			
			concertaciones.map(item => 
				<option value={item.id_conc_tema} label={item.conc_tema}>
					{item.conc_tema} 
				</option>				
			) 
		)
	};	
	
	return (
		<>
			<form className="form-control" onSubmit={formik.handleSubmit}>
				<div className="form-group mt-3" id="asg_estudiante_id">
					<label>Seleccione el estudiante encargado para la asignaci�n</label>
					<select
					  type="text"
					  name="asg_estudiante_id"
					  value={formik.values.asg_estudiante_id}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.asg_estudiante_id && formik.touched.asg_estudiante_id
									? "is-invalid" : "" )
								}>
						<option value="" label="Seleccione una opcion">Seleccione una opci�n</option>	
						{RenderEstudiantes()} 
					</select>
					<div>{(formik.errors.asg_estudiante_id) ? <p style={{color: 'red'}}>{formik.errors.asg_estudiante_id}</p> : null}</div>
				</div>		
				<div className="form-group mt-3" id="asg_conc_id">
					<label>Seleccione la concertaci�n para la asignaci�n</label>
					<select
					  type="text"
					  name="asg_conc_id"
					  value={formik.values.asg_conc_id}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.asg_conc_id && formik.touched.asg_conc_id
									? "is-invalid" : "" )
								}>
						<option value="" label="Seleccione una opcion">Seleccione una opci�n</option>	
						{RenderConcertaciones()} 
					</select>
					<div>{(formik.errors.asg_conc_id) ? <p style={{color: 'red'}}>{formik.errors.asg_conc_id}</p> : null}</div>
				</div>	
				<div className="form-group mt-3" id="asg_tipo_tarea_id">
					<label>Seleccione el tipo de tarea para la asignaci�n</label>
					<select
					  type="text"
					  name="asg_tipo_tarea_id"
					  value={formik.values.asg_tipo_tarea_id}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.asg_tipo_tarea_id && formik.touched.asg_tipo_tarea_id
									? "is-invalid" : "" )
								}>
						<option value="" label="Seleccione una opcion">Seleccione una opci�on</option>	
						{RenderTipoTareas()} 
					</select>
					<div>{(formik.errors.asg_tipo_tarea_id) ? <p style={{color: 'red'}}>{formik.errors.asg_tipo_tarea_id}</p> : null}</div>
				</div>	
				<div className="form-group mt-3" id="asg_tema">
					<label>Introduzca la descripci�n para la asignaci�n</label>
					<textarea
					  rows="2"
					  name="asg_descripcion"
					  value={formik.values.asg_descripcion}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.asg_descripcion && formik.touched.asg_descripcion
									? "is-invalid" : "" )}
					  placeholder="Descripci�n de la asignaci�n"
					>	
					</textarea>
					<div>{(formik.errors.asg_descripcion) ? <p style={{color: 'red'}}>{formik.errors.asg_descripcion}</p> : null}</div>
				</div>
				<div className="form-group mt-3" id="asg_fecha_inicio">
					<label>Introduzca fecha de inicio para la asignaci�n: </label>
					<DatePicker
					  dateFormat="dd/MM/yyyy"
					  id="asg_fecha_inicio"
					  name="asg_fecha_inicio"
					  selected={formik.values.asg_fecha_inicio}					  
					  onChange={(value) => formik.setFieldValue("asg_fecha_inicio", value)}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.asg_fecha_inicio && formik.touched.asg_fecha_inicio
									? "is-invalid" : "" )}
					  placeholder="Selecciona una fcha para la asignaci�n"
					/>					
					<div>{(formik.errors.asg_fecha_inicio) ? <p style={{color: 'red'}}>{formik.errors.asg_fecha_inicio}</p> : null}</div>
				</div>		
				<div className="form-group mt-3" id="asg_fecha_fin">
					<label>Introduzca fecha de fin para la asignaci�n: </label>
					<DatePicker
					  dateFormat="dd/MM/yyyy"
					  id="asg_fecha_fin"
					  name="asg_fecha_fin"
					  selected={formik.values.asg_fecha_fin}					  
					  onChange={(value) => formik.setFieldValue("asg_fecha_fin", value)}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.asg_fecha_fin && formik.touched.asg_fecha_fin
									? "is-invalid" : "" )}
					  placeholder="Selecciona una fecha para la asignaci�n"
					/>							
					<div>{(formik.errors.asg_fecha_fin) ? <p style={{color: 'red'}}>{formik.errors.asg_fecha_fin}</p> : null}</div>
				</div>					
				<div className="form-group mt-3" id="asg_complejidad_estimada">
					<label>Seleccione el nivel del complejidad para la asignaci�n</label>
					<select
					  type="text"
					  name="asg_complejidad_estimada"
					  value={formik.values.asg_complejidad_estimada}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.asg_complejidad_estimada && formik.touched.asg_complejidad_estimada
									? "is-invalid" : "" )
								}>
						{RenderOptions(complejidad_options)} 
					</select>
					<div>{(formik.errors.asg_complejidad_estimada) ? <p style={{color: 'red'}}>{formik.errors.asg_complejidad_estimada}</p> : null}</div>
				</div>		
				<div className="form-group mt-3" id="asg_participantes">
					<label>Introduzca el n�mero de participantes para la concertacion</label>
					<input
					  type="text"
					  name="asg_participantes"
					  value={formik.values.asg_participantes}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.asg_participantes && formik.touched.asg_participantes
									? "is-invalid" : "" )}
					  placeholder="N�mero de participantes"
					/>					
					<div>{(formik.errors.asg_participantes) ? <p style={{color: 'red'}}>{formik.errors.asg_participantes}</p> : null}</div>
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