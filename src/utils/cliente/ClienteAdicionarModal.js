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


export default function ClienteModificarModal( ) {
	
	const { token, setMessages, messages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
    const [centrospracticas, setCentrosPracticas] = useState([]);
    const [usuariosclientes, setUsuariosClientes] = useState([]);
	
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
			url: "/cliente/crear_cliente/",
			data: {
				cli_numero_empleos : formik.values.cli_numero_empleos,
				cli_pos_tecnica_trabajo : formik.values.cli_pos_tecnica_trabajo,
				cli_pos_tecnica_hogar : formik.values.cli_pos_tecnica_hogar,
				cli_cargo : formik.values.cli_cargo,
				cli_trab_remoto : formik.values.cli_trab_remoto,
				cli_categoria_docente : formik.values.cli_categoria_docente, 
				cli_categoria_cientifica : formik.values.cli_categoria_cientifica,  
				cli_experiencia_practicas : formik.values.cli_experiencia_practicas, 
				cli_numero_est_atendidos : formik.values.cli_numero_est_atendidos,
                cli_centro_id : formik.values.cli_centro_id,	
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
		cli_numero_empleos: Yup.string().trim()
			.required("Se requiere el némero de empleos del cliente"),
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
			.required("Se requiere la categoría docente del cliente"),
		cli_categoria_cientifica: Yup.string().trim()
			.required("Se requiere la categoría científica del cliente"),
		cli_experiencia_practicas: Yup.string().trim()
			.required("Se requiere la experiencia en prácticas profesionales del cliente"),
		cli_experiencia_practicas: Yup.string().trim()
			.required("Se requiere la experiencia en prácticas profesionales del cliente"),
		cli_numero_est_atendidos: Yup.string().trim()
			.required("Se requiere el número de estudiantes atendidos por el cliente"),
        cli_centro_id: Yup.string().trim()
            .required("Se requiere el centro de pertenencia del cliente"),
        user_cliente_id: Yup.string().trim()
            .required("Se requiere seleccione un cliente")
	});
	
	const registerInitialValues = {
		cli_numero_empleos : 1,
		cli_pos_tecnica_trabajo : nivel_tecno_options[0]["value"],
		cli_pos_tecnica_hogar : nivel_tecno_options[0]["value"],
		cli_cargo : false,
		cli_trab_remoto : false,
		cli_categoria_docente : categoria_doc_opt[0]["value"], 
		cli_categoria_cientifica : categoria_cient_opt[0]["value"],  
		cli_experiencia_practicas : false, 
		cli_numero_est_atendidos : 1,  
        cli_centro_id : "",
		user_cliente_id: ""
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Guardando datos...")
			console.log(values)
			adicionarCliente();
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
        leerCentrosPracticas();
    }, []);	
	
	const leerCentrosPracticas = async () => {
		await axios({
			method: 'get',
			url: '/centro/leer_centropracticas/',			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {	
				setCentrosPracticas(response.data);
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});				  
	}
	
	const RenderCentrosPracticas = (entidadescontexto) => {
		return (			
			centrospracticas.map(item => 
				<option value={item.id_centro} label={item.centro_siglas}>{item.centro_siglas}</option>				
			) 
		)
	};	
	
	useEffect(()=> {
		leerUsuariosClientes();
    }, [messages]);	
	
	const leerUsuariosClientes = async () => {
		await axios({
			method: 'get',
			url: '/usuario/obtener_usuarios/cliente',
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setUsuariosClientes(response.data);				
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
		});				  
	}
	
	const RenderUsuariosClientes = () => {
		return (			
			usuariosclientes.map(item => 
				<option value={item.id} label={item.nombre + " " + item.primer_appellido}>
					{item.nombre + " " + item.primer_appellido}
				</option>	
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
                    <div className="form-group mt-3" id="user_cliente_id">
                        <label>Seleccione un usuario para trabajar en las prácticas laborales</label>
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
                            {RenderUsuariosClientes()}
                        <option value="" label="Seleccione un cliente">Seleccione una opcion</option>	
                        </select>
                        <div>{(formik.errors.user_cliente_id) ? <p style={{color: 'red'}}>{formik.errors.user_cliente_id}</p> : null}</div>
                    </div>	
                    <div className="form-group mt-3" id="cli_centro_id">
                        <label>Seleccione el centro de prácticas</label>
                        <select
                        type="text"
                        name="cli_centro_id"
                        value={formik.values.cli_centro_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={"form-control mt-1" + 
                                        (formik.errors.cli_centro_id && formik.touched.cli_centro_id
                                        ? "is-invalid" : "" )
                                    }>
                            <option value="" label="Seleccione una opcion">Seleccione una opcion</option>	
                            { RenderCentrosPracticas(centrospracticas) } 
                        </select>
                        <div>{(formik.errors.cli_centro_id) ? <p style={{color: 'red'}}>{formik.errors.cli_centro_id}</p> : null}</div>
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
						  placeholder="N�mero de empleos del cliente"
						/>					
						<div>{(formik.errors.cli_numero_empleos) ? <p style={{color: 'red'}}>{formik.errors.cli_numero_empleos}</p> : null}</div>
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
						  placeholder="N�mero de estudiantes (valor entero, ej. 2)"
						/>					
						<div>{(formik.errors.cli_numero_est_atendidos) ? <p style={{color: 'red'}}>{formik.errors.cli_numero_est_atendidos}</p> : null}</div>
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