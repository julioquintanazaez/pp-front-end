import React, {useState, useEffect, useContext} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from '../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';


export default function AsignacionAdicionarModal(  ) {
	
	const { token, setMessages, messages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
    const [concertaciones, setConcertaciones] = useState([]);
	
	//Options configurations
	const complejidad_options = [
								{ value: "Baja", label: "Baja" },
								{ value: "Media", label: "Media" },
								{ value: "Alta", label: "Alta" }
							];	

    const tipos_de_tarea = [
								{ value: "Desarrollo", label: "Desarrollo" },
								{ value: "Investigacion", label: "Investigación" },
								{ value: "Documentacion", label: "Documentación" },
                                { value: "Comunicacion", label: "Comunicación" },
                                { value: "Revision", label: "Revisión" }
							];	
	
    const formatDate = (date) => {		
        return date.toISOString().split('T')[0]
    };		

	const adicionarAsignacion = async () => {
		console.log("Entro a endpoint")
		await axios({
			method: 'post',
			url: "/tarea/crear_tarea/",
			data: {
                tarea_tipo : formik.values.tarea_tipo,
                tarea_descripcion : formik.values.tarea_descripcion,
				tarea_fecha_inicio : formatDate(formik.values.tarea_fecha_inicio),
				tarea_fecha_fin : formatDate(formik.values.tarea_fecha_fin),
				tarea_complejidad_estimada : formik.values.tarea_complejidad_estimada,
				tarea_participantes : formik.values.tarea_participantes,	
			    concertacion_tarea_id : formik.values.concertacion_tarea_id,			
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Asignacion actualizado"+ Math.random());
				Swal.fire("Tarea creada exitosamente", "", "success");
			} 
		}).catch((error) => {
			console.log({"message":error.message, "detail":error.response.data.detail});
			//handleLogout();
            Swal.fire(error.response.data.detail, "", "error");
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
		tarea_descripcion: Yup.string().trim()
			.required("Se requiere el tema para la tarea"),
        tarea_fecha_inicio: Yup.date()
			.required("Se requiere la valoración para la tarea"),
        tarea_fecha_fin: Yup.date()
			.required("Se requiere la valoración del profesor para la tarea")
			.min(Yup.ref("tarea_fecha_inicio"), "La fecha de fin debe ser superior a la de inicio"),
        tarea_complejidad_estimada: Yup.string().trim()
			.required("Se requiere la valoración del cliente para la tarea"),
        tarea_tipo: Yup.string().trim()
			.required("Se requiere el tipo de tarea"),
        tarea_participantes: Yup.number()
			.required("Se requiere el nivel de complejidad para la tarea"),
		concertacion_tarea_id: Yup.string().trim()
            .required("Se requiere la concertación para la tarea")		
	});
	
	const registerInitialValues = {
		tarea_descripcion : "",
		tarea_fecha_inicio : new Date(),
		tarea_fecha_fin : new Date(),
		tarea_complejidad_estimada : complejidad_options[0]["value"],
		tarea_participantes : 1,
		tarea_tipo : tipos_de_tarea[0]["value"],
		concertacion_tarea_id : ""		
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Guardando data...")
			console.log(values)
			adicionarAsignacion();
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
		leerConcertaciones();
    }, [messages]);	
	
	const leerConcertaciones = async () => {
		
		await axios({
			method: 'get',
			url: '/concertacion/leer_concertaciones/',			
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
                    <div className="form-group mt-3" id="concertacion_tarea_id">
                        <label>Seleccione la concertación para la tarea</label>
                        <select
                        type="text"
                        name="concertacion_tarea_id"
                        value={formik.values.concertacion_tarea_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={"form-control mt-1" + 
                                        (formik.errors.concertacion_tarea_id && formik.touched.concertacion_tarea_id
                                        ? "is-invalid" : "" )
                                    }>
                            <option value="" label="Seleccione una opcion">Seleccione una opción</option>	
                            {RenderConcertaciones()} 
                        </select>
                        <div>{(formik.errors.concertacion_tarea_id) ? <p style={{color: 'red'}}>{formik.errors.concertacion_tarea_id}</p> : null}</div>
                    </div>	
					<div className="form-group mt-3" id="tarea_descripcion">
						<label>Introduzca la descripción para la tarea</label>
						<textarea
						  rows="2"
						  name="tarea_descripcion"
						  value={formik.values.tarea_descripcion}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.tarea_descripcion && formik.touched.tarea_descripcion
										? "is-invalid" : "" )}
						  placeholder="Descripción de la asignación"
						>	
						</textarea>
						<div>{(formik.errors.tarea_descripcion) ? <p style={{color: 'red'}}>{formik.errors.tarea_descripcion}</p> : null}</div>
					</div>
                    <div className="form-group mt-3" id="tarea_tipo">
						<label>Seleccione el tipo de trabajo para la tarea</label>
						<select
						  type="text"
						  name="tarea_tipo"
						  value={formik.values.tarea_tipo}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.tarea_tipo && formik.touched.tarea_tipo
										? "is-invalid" : "" )
									}>
							{RenderOptions(tipos_de_tarea)} 
						</select>
						<div>{(formik.errors.tarea_tipo) ? <p style={{color: 'red'}}>{formik.errors.tarea_tipo}</p> : null}</div>
					</div>
					<div className="form-group mt-3" id="tarea_fecha_inicio">
						<label>Introduzca fecha de inicio para la asignación: </label>
						<DatePicker
						  dateFormat="dd/MM/yyyy"
						  id="tarea_fecha_inicio"
						  name="tarea_fecha_inicio"
						  selected={formik.values.tarea_fecha_inicio}					  
						  onChange={(value) => formik.setFieldValue("tarea_fecha_inicio", value)}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.tarea_fecha_inicio && formik.touched.tarea_fecha_inicio
										? "is-invalid" : "" )}
						  placeholder="Selecciona una fecha para la tarea"
						/>					
						<div>{(formik.errors.tarea_fecha_inicio) ? <p style={{color: 'red'}}>{formik.errors.tarea_fecha_inicio}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="tarea_fecha_fin">
						<label>Introduzca fecha de fin para la tarea: </label>
						<DatePicker
						  dateFormat="dd/MM/yyyy"
						  id="tarea_fecha_fin"
						  name="tarea_fecha_fin"
						  selected={formik.values.tarea_fecha_fin}					  
						  onChange={(value) => formik.setFieldValue("tarea_fecha_fin", value)}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.tarea_fecha_fin && formik.touched.tarea_fecha_fin
										? "is-invalid" : "" )}
						  placeholder="Selecciona una fecha para la tarea"
						/>							
						<div>{(formik.errors.tarea_fecha_fin) ? <p style={{color: 'red'}}>{formik.errors.tarea_fecha_fin}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="tarea_complejidad_estimada">
						<label>Seleccione el nivel del complejidad para la tarea</label>
						<select
						  type="text"
						  name="tarea_complejidad_estimada"
						  value={formik.values.tarea_complejidad_estimada}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.tarea_complejidad_estimada && formik.touched.tarea_complejidad_estimada
										? "is-invalid" : "" )
									}>
							{RenderOptions(complejidad_options)} 
						</select>
						<div>{(formik.errors.tarea_complejidad_estimada) ? <p style={{color: 'red'}}>{formik.errors.tarea_complejidad_estimada}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="tarea_participantes">
						<label>Introduzca el número de participantes en el equipo</label>
						<input
						  type="text"
						  name="tarea_participantes"
						  value={formik.values.tarea_participantes}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.tarea_participantes && formik.touched.tarea_participantes
										? "is-invalid" : "" )}
						  placeholder="Número de participantes"
						/>					
						<div>{(formik.errors.tarea_participantes) ? <p style={{color: 'red'}}>{formik.errors.tarea_participantes}</p> : null}</div>
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