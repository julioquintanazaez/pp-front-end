import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect, useContext} from "react";
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";

export default function ConcertacionAdicionar ( ) {
	
	const [validated, setValidated] = useState(false);
	const { setMessages, token, handleLogout } = useContext(Context);
	const [profesores, setProfesores] = useState([]);
	const [clientes, setClientes] = useState([]);
	
	//Options configurations
	const complejidad_options = [
								{ value: "Baja", label: "Baja" },
								{ value: "Media", label: "Media" },
								{ value: "Alta", label: "Alta" }
							];								
	
	const adicionarConcertacion = async () => {
		
		await axios({
			method: 'post',
			url: '/crear_concertacion_tema/',
			data: {
				conc_tema : formik.values.conc_tema,
				conc_descripcion : formik.values.conc_descripcion,
				conc_valoracion_prof : formik.values.conc_valoracion_prof,
				conc_valoracion_cliente : formik.values.conc_valoracion_cliente,
				conc_complejidad : formik.values.conc_complejidad,
				conc_actores_externos : formik.values.conc_actores_externos,
				conc_profesor_id : formik.values.conc_profesor_id,  
				conc_cliente_id : formik.values.conc_cliente_id							
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Concertacion creado"+ Math.random());
				Swal.fire("Concertacion creado exitosamente", "", "success");
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
		});				  
	}
  
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		conc_tema: Yup.string().trim()
			.required("Se requiere el tema para la concertacion"),
		conc_descripcion: Yup.string().trim()
			.required("Se requiere la descripción para la concertacion"),
		conc_valoracion_prof: Yup.string().trim()
			.required("Se requiere la valoración del profesor para la concertacion"),
		conc_valoracion_cliente: Yup.string().trim()
			.required("Se requiere la valoración del cliente para la concertacion"),
		conc_complejidad: Yup.string().trim()
			.required("Se requiere el nivel de complejidad para la concertacion"),
		conc_actores_externos: Yup.string().trim()
			.required("Se requiere número de actores externos para la concertacion"),
		conc_profesor_id: Yup.string().trim()
			.required("Se requiere el profesor para la concertacion"),
		conc_cliente_id: Yup.string().trim()
			.required("Se requiere el cliente para la concertacion")		
	});
	
	const registerInitialValues = {
		conc_tema : "",
		conc_descripcion : "",
		conc_valoracion_prof : "",
		conc_valoracion_cliente : "",
		conc_complejidad : complejidad_options[0]["value"],
		conc_actores_externos : 0,
		conc_profesor_id : "",  
		conc_cliente_id : ""			
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Guardar datos...")
			console.log(values)
			adicionarConcertacion();
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
			<form className="form-control" onSubmit={formik.handleSubmit}>
				<div className="form-group mt-3" id="conc_tema">
					<label>Introduzca el tema para la concertacion</label>
					<input
					  type="text"
					  name="conc_tema"
					  value={formik.values.conc_tema}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.conc_tema && formik.touched.conc_tema
									? "is-invalid" : "" )}
					  placeholder="Tema de la concertación"
					/>					
					<div>{(formik.errors.conc_tema) ? <p style={{color: 'red'}}>{formik.errors.conc_tema}</p> : null}</div>
				</div>
				<div className="form-group mt-3" id="conc_descripcion">
					<label>Introduzca la descripción para la concertacion</label>
					<textarea
					  rows="2"
					  name="conc_descripcion"
					  value={formik.values.conc_descripcion}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.conc_descripcion && formik.touched.conc_descripcion
									? "is-invalid" : "" )}
					  placeholder="Descripción para la concertacion"
					>	
					</textarea>
					<div>{(formik.errors.conc_descripcion) ? <p style={{color: 'red'}}>{formik.errors.conc_descripcion}</p> : null}</div>
				</div>		
				<div className="form-group mt-3" id="conc_valoracion_prof">
					<label>Introduzca la valoración del profesor para la concertacion</label>
					<textarea
					  rows="2"
					  name="conc_valoracion_prof"
					  value={formik.values.conc_valoracion_prof}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.conc_valoracion_prof && formik.touched.conc_valoracion_prof
									? "is-invalid" : "" )}
					  placeholder="Valoración del profesor para la concertacion"
					>		
					</textarea>
					<div>{(formik.errors.conc_valoracion_prof) ? <p style={{color: 'red'}}>{formik.errors.conc_valoracion_prof}</p> : null}</div>
				</div>		
				<div className="form-group mt-3" id="conc_valoracion_cliente">
					<label>Introduzca valoración del cliente para la concertacion</label>
					<textarea
					  rows="2"
					  name="conc_valoracion_cliente"
					  value={formik.values.conc_valoracion_cliente}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.conc_valoracion_cliente && formik.touched.conc_valoracion_cliente
									? "is-invalid" : "" )}
					  placeholder="Valoración del cliente para la concertacion"
					>	
					</textarea>
					<div>{(formik.errors.conc_valoracion_cliente) ? <p style={{color: 'red'}}>{formik.errors.conc_valoracion_cliente}</p> : null}</div>
				</div>					
				<div className="form-group mt-3" id="conc_complejidad">
					<label>Seleccione el nivel del complejidad para la concertacion</label>
					<select
					  type="text"
					  name="conc_complejidad"
					  value={formik.values.conc_complejidad}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.conc_complejidad && formik.touched.conc_complejidad
									? "is-invalid" : "" )
								}>
						{RenderOptions(complejidad_options)} 
					</select>
					<div>{(formik.errors.conc_complejidad) ? <p style={{color: 'red'}}>{formik.errors.conc_complejidad}</p> : null}</div>
				</div>		
				<div className="form-group mt-3" id="conc_actores_externos">
					<label>Introduzca el número de actores externos para la concertacion</label>
					<input
					  type="text"
					  name="conc_actores_externos"
					  value={formik.values.conc_actores_externos}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.conc_actores_externos && formik.touched.conc_actores_externos
									? "is-invalid" : "" )}
					  placeholder="Número de actores externos"
					/>					
					<div>{(formik.errors.conc_actores_externos) ? <p style={{color: 'red'}}>{formik.errors.conc_actores_externos}</p> : null}</div>
				</div>
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
		</>
	);
}