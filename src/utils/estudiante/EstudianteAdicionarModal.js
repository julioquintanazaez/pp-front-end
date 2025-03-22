import React, {useState, useEffect, useContext} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from '../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";
import { BiBox } from 'react-icons/bi'; 
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';



export default function estudianteAdicionarModal( ) {
	
	const { token, setMessages, messages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
    const [universidades, setUniversidades] = useState([]);
    const [usuariosestudiantes, setUsuariosEstudiantes] = useState([]);
	const [tareas, setTareas] = useState([]);
	
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
								
	const adicionarEstudiante = async () => {
		
		await axios({
			method: 'post',
			url: "/estudiante/crear_estudiante/",
			data: {
				est_trabajo : formik.values.est_trabajo,
				est_becado : formik.values.est_becado,
				est_posibilidad_economica : formik.values.est_posibilidad_economica,
				est_pos_tecnica_escuela : formik.values.est_pos_tecnica_escuela,
				est_pos_tecnica_hogar : formik.values.est_pos_tecnica_hogar,
				est_trab_remoto : formik.values.est_trab_remoto,
                est_universidad_id : formik.values.est_universidad_id,	
				user_estudiante_id : formik.values.user_estudiante_id,
				tareas_estudiantes_id : formik.values.tareas_estudiantes_id,
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
			handleLogout();
		});				  
	}
  
	const handleClose = () => {
		setShow(false);
	}
	
	const handleShow = () => {
		setShow(true);  
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		est_trabajo: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opción")
			.required("Se requiere marque una opción"),	
		est_becado: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opción")
			.required("Se requiere marque una opción"),	
		est_posibilidad_economica: Yup.string().trim()
			.required("Se requiere la posibilidad económica del del estudiante"),
		est_pos_tecnica_escuela: Yup.string().trim()
			.required("Se requiere la posibilidad técnica del trabajo del estudiante"),
		est_pos_tecnica_hogar: Yup.string().trim()
			.required("Se requiere la posibilidad técnica del hogar del estudiante"),
		est_trab_remoto: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opción")
			.required("Se requiere marque una opción"),
        est_universidad_id: Yup.string().trim()
            .required("Se requiere el centro de pertenencia del estudiante"),
        user_estudiante_id: Yup.string().trim()
            .required("Se requiere seleccionar un estudiante"),
		tareas_estudiantes_id: Yup.string().trim()
			.required("Se requiere seleccionar una tarea"),
	});
	
	const registerInitialValues = {
		est_trabajo : false,
		est_becado : false,
		est_hijos : false,
		est_posibilidad_economica : por_econom_options[0]["value"],
		est_pos_tecnica_escuela : nivel_tecno_options[0]["value"],
		est_pos_tecnica_hogar : nivel_tecno_options[0]["value"],
		est_trab_remoto : false,
		est_universidad_id : "",
		user_estudiante_id : "",
		tareas_estudiantes_id: "",
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Save data...")
			console.log(values)
			adicionarEstudiante();
			formik.resetForm();
			handleClose();
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
		leerUsuariosEstudiantes();
		leerUniversidades();
		leerTareas();
    }, [messages]);	
	
	const leerUsuariosEstudiantes = async () => {
		await axios({
			method: 'get',
			url: '/usuario/obtener_usuarios/estudiante',
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setUsuariosEstudiantes(response.data);				
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
		});				  
	}
	
	const RenderUsuarios = () => {
		return (			
			usuariosestudiantes.map(item => 
				<option value={item.id} label={item.nombre + " " + item.primer_appellido + " " + item.segundo_appellido}>
					{item.nombre + " " + item.primer_appellido + " " + item.segundo_appellido}
				</option>				
			) 
		)
	};	

	const leerUniversidades = async () => {
		
		await axios({
			method: 'get',
			url: '/universidad/leer_universidades/',			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {	
				setUniversidades(response.data);
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});				  
	}
	
	const RenderUniversidades = (universidades) => {
		return (			
			universidades.map(item => 
				<option value={item.id_universidad} label={item.universidad_siglas}>{item.universidad_siglas}</option>				
			) 
		)
	};	

	const leerTareas = async () => {
		
		await axios({
			method: 'get',
			url: '/tarea/leer_tareas/',			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {	
				setTareas(response.data);
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});				  
	}
	
	const RenderTareas = (universidades) => {
		return (			
			tareas.map(item => 
				<option value={item.id_tarea} label={item.tarea_descripcion}>{item.tarea_descripcion}</option>				
			) 
		)
	};	
		
	return (
		<>
		<button className="btn btn-sm btn-success" onClick={handleShow}>
			Adicionar 
		</button>
		<Modal show={show} onHide={handleClose} size="lm" > 
			<Modal.Header closeButton>
				<Modal.Title>
					Adicionar
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<form className="form-control" onSubmit={formik.handleSubmit}>
                <div className="form-group mt-3" id="user_estudiante_id">
                        <label>Seleccione un estudiante para trabajar en las prácticas laborales</label>
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
                            <option value="" label="Seleccione un estudiante">Seleccione un usuario de la lista</option>	
                            {RenderUsuarios()}					
                        </select>
                        <div>{(formik.errors.user_estudiante_id) ? <p style={{color: 'red'}}>{formik.errors.user_estudiante_id}</p> : null}</div>
                    </div>	
                    <div className="form-group mt-3" id="est_universidad_id">
                        <label>Seleccione la universidad de origen del estudiante</label>
                        <select
                        type="text"
                        name="est_universidad_id"
                        value={formik.values.est_universidad_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={"form-control mt-1" + 
                                        (formik.errors.est_universidad_id && formik.touched.est_universidad_id
                                        ? "is-invalid" : "" )
                                    }>
                            <option value="" label="Seleccione una opcion">Seleccione una opción</option>	
                            { RenderUniversidades(universidades) } 
                        </select>	
                        <div>{(formik.errors.est_universidad_id) ? <p style={{color: 'red'}}>{formik.errors.est_universidad_id}</p> : null}</div>
                    </div>	
					<div className="form-group mt-3" id="tareas_estudiantes_id">
                        <label>Seleccione una tarea para trabajar en las prácticas laborales</label>
                        <select
                        type="text"
                        name="tareas_estudiantes_id"
                        value={formik.values.tareas_estudiantes_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={"form-control mt-1" + 
                                        (formik.errors.tareas_estudiantes_id && formik.touched.tareas_estudiantes_id
                                        ? "is-invalid" : "" )
                                    }>
                            <option value="" label="Seleccione una tarea">Seleccione una tarea de la lista</option>	
                            {RenderTareas()}					
                        </select>
                        <div>{(formik.errors.tareas_estudiantes_id) ? <p style={{color: 'red'}}>{formik.errors.tareas_estudiantes_id}</p> : null}</div>
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