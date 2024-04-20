import React, {useState, useEffect, useContext} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';


export default function ConcertacionActoresModificarModal( props ) {
	
	const { token, setMessages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	const [profesores, setProfesores] = useState([]);
	const [clientes, setClientes] = useState([]);
	
	const modificarActoresConcertacion = async () => {
		
		await axios({
			method: 'put',
			url: "/actualizar_responsables_concertacion/" + props.concertacion.id_conc_tema,
			data: {
				conc_profesor_id : formik.values.conc_profesor_id,  
				conc_cliente_id : formik.values.conc_cliente_id								
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				setMessages("Actores de la concertacion actualizado"+ Math.random());
				Swal.fire("Actores de la concertacion actualizado exitosamente", "", "success");
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
		if (props.concertacion.id_conc_tema != null){	
			setShow(true);  
		}else{
			Swal.fire("No se ha seleccionado Concertacion", props.concertacion.id_conc_tema, "error");
		}
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		conc_profesor_id: Yup.string().trim()
			.required("Se requiere el profesor para la concertacion"),
		conc_cliente_id: Yup.string().trim()
			.required("Se requiere el cliente para la concertacion")	
	});
	
	const registerInitialValues = {
		conc_profesor_id : "",  
		conc_cliente_id : ""		
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Modificando data...")
			console.log(values)
			modificarActoresConcertacion();
			formik.resetForm();
		},
		validationSchema: validationRules
	});
	
	useEffect(()=> {
        leerProfesores();
		leerClientes();
    }, []);	
	
	const leerProfesores = async () => {
		
		await axios({
			method: 'get',
			url: '/leer_profesores/',			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {	
				setProfesores(response.data);
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});				  
	};
	
	const RenderProfesores = () => {
		return (			
			profesores.map(item => 
				<option value={item.id_profesor} label={item.prf_nombre}>
					{item.prf_nombre} {item.prf_primer_appellido}
				</option>				
			) 
		)
	};	
	
	const leerClientes = async () => {
		
		await axios({
			method: 'get',
			url: '/leer_clientes/',			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {	
				setClientes(response.data);
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});				  
	};
	
	const RenderClientes = () => {
		return (			
			clientes.map(item => 
				<option value={item.id_cliente} label={item.cli_nombre}>
					{item.cli_nombre} {item.cli_primer_appellido}
				</option>				
			) 
		)
	};	
		
	return (
		<>
		<button className="btn btn-sm btn-info" onClick={handleShow}>
			Cambiar 
		</button>
		<Modal show={show} onHide={handleClose} size="lm" > 
			<Modal.Header closeButton>
				<Modal.Title>
					Modificar {props.concertacion.conc_tema} 
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<form className="form-control" onSubmit={formik.handleSubmit}>					
					<div className="form-group mt-3" id="conc_profesor_id">
						<label>Seleccione el profesor encargado para la concertacion</label>
						<select
						  type="text"
						  name="conc_profesor_id"
						  value={formik.values.conc_profesor_id}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.conc_profesor_id && formik.touched.conc_profesor_id
										? "is-invalid" : "" )
									}>
							<option value="" label="Seleccione una opcion">Seleccione una opciçon</option>	
							{RenderProfesores()} 
						</select>
						<div>{(formik.errors.conc_profesor_id) ? <p style={{color: 'red'}}>{formik.errors.conc_profesor_id}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="conc_cliente_id">
						<label>Seleccione el cliente encargado para la concertacion</label>
						<select
						  type="text"
						  name="conc_cliente_id"
						  value={formik.values.conc_cliente_id}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.conc_cliente_id && formik.touched.conc_cliente_id
										? "is-invalid" : "" )
									}>
							<option value="" label="Seleccione una opcion">Seleccione una opción</option>	
							{RenderClientes()} 
						</select>
						<div>{(formik.errors.conc_cliente_id) ? <p style={{color: 'red'}}>{formik.errors.conc_cliente_id}</p> : null}</div>
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