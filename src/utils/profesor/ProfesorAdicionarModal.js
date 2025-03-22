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

export default function ProfesorModificarModal( ) {
	
	const { token, setMessages, messages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [universidades, setUniversidades] = useState([]);
	
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
								{ value: "Tecnico", label: "Tecnico" },
								{ value: "Ingeniero", label: "Ingeniero" },
								{ value: "Licenciado", label: "Licenciado" },
								{ value: "Master", label: "Master" },
								{ value: "Doctor", label: "Doctor" }
							];	
							
	const adicionarProfesor = async () => {
		
		await axios({
			method: 'post',
			url: "/profesor/crear_profesor/",
			data: {
				prf_numero_empleos : formik.values.prf_numero_empleos,
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
				setMessages("Profesor agregado"+ Math.random());
				Swal.fire("Profesor agregado exitosamente", "", "success");
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
		prf_numero_empleos: Yup.number().positive()
			.min(1)
			.required("Se requiere el número de empleos del profesor"),
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
			.required("Se requiere el número de estudiantes atendidos por el profesor"),
        prf_universidad_id: Yup.string().trim()
            .required("Se requiere el centro de pertenencia del profesor"),
        user_profesor_id: Yup.string().trim()
            .required("Se requiere seleccione un profesor")	
	});
	
	const registerInitialValues = {
		prf_numero_empleos : 1,
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
			console.log("Save data...")
			console.log(values)
			adicionarProfesor();
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
		leerUsuariosProfesores();
    }, [messages]);	
	
	const leerUsuariosProfesores = async () => {
		await axios({
			method: 'get',
			url: '/usuario/obtener_usuarios/profesor',
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

    useEffect(()=> {
        leerUniversidades();
    }, []);	
	
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
                    <div className="form-group mt-3" id="user_profesor_id">
                        <label>Seleccione un usuario para trabajar en las prácticas laborales</label>
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
                            <option value="" label="Seleccione un profesor">Seleccione un usuario de la lista</option>	
                            {RenderUsuarios()}					
                        </select>
                        <div>{(formik.errors.user_profesor_id) ? <p style={{color: 'red'}}>{formik.errors.user_profesor_id}</p> : null}</div>
                    </div>	
                    <div className="form-group mt-3" id="prf_universidad_id">
                        <label>Seleccione la universidad de origen del profesor</label>
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
                            <option value="" label="Seleccione una opcion">Seleccione una opción</option>	
                            { RenderUniversidades(universidades) } 
                        </select>	
                        <div>{(formik.errors.prf_universidad_id) ? <p style={{color: 'red'}}>{formik.errors.prf_universidad_id}</p> : null}</div>
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