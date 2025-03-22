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


export default function AsignacionModificarTipoTareaModal( props ) {
	
	const { token, setMessages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	const [tipotareas, setTipoTareas] = useState([]);
	
	const modificarAsignacionTareaTipo = async () => {
		
		await axios({
			method: 'put',
			url: "/actualizar_asignacion_tarea_tipo/" + props.asignacion.id_asignacion,
			data: {
				asg_tipo_tarea_id : formik.values.asg_tipo_tarea_id					
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Asignacion tipo tarea actualizado"+ Math.random());
				Swal.fire("Asignacion tipo tarea actualizado exitosamente", "", "success");
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
		if (props.asignacion.id_asignacion != null){	
			setShow(true);  
		}else{
			Swal.fire("No se ha seleccionado la Asignaci�n de tema", props.asignacion.id_asignacion, "error");
		}
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		asg_tipo_tarea_id: Yup.string().trim()
			.required("Se requiere n�mero de actores externos para la concertacion")
	});
	
	//console.log(props.asignacion.asg_fecha_inicio)
	
	const registerInitialValues = {
		asg_tipo_tarea_id : ""	
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Modificando data...")
			console.log(values)
			modificarAsignacionTareaTipo();
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
			
	return (
		<>
		<button className="btn btn-sm btn-info" onClick={handleShow}>
			Tipo 
		</button>
		<Modal show={show} onHide={handleClose} size="lm" > 
			<Modal.Header closeButton>
				<Modal.Title>
					Modificar {props.asignacion.asg_descripcion} 
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<form className="form-control" onSubmit={formik.handleSubmit}>
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