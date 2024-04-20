import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect, useContext} from "react";
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";

export default function TipoTareaAdicionar ( ) {
	
	const [validated, setValidated] = useState(false);
	const { setMessages, token } = useContext(Context);
	
	const adicionarTipoTarea = async () => {
		
		await axios({
			method: 'post',
			url: '/crear_tipo_tarea/',
			data: {
				tarea_tipo_nombre : formik.values.tarea_tipo_nombre								
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Tipo de Tarea creado"+ Math.random());
				Swal.fire("Tipo de Tarea creado exitosamente", "", "success");
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
		});				  
	}
  
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		tarea_tipo_nombre: Yup.string().trim()
			.required("Se requiere el nombre para el tipo de tarea")			
	});
	
	const registerInitialValues = {
		tarea_tipo_nombre : ""	
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Guardar datos...")
			console.log(values)
			adicionarTipoTarea();
			formik.resetForm();
		},
		validationSchema: validationRules
	});
	
	return (
		<>
			<form className="form-control" onSubmit={formik.handleSubmit}>
				<div className="form-group mt-3" id="tarea_tipo_nombre">
					<label>Introduzca el nombre para el tipo de tarea</label>
					<input
					  type="text"
					  name="tarea_tipo_nombre"
					  value={formik.values.tarea_tipo_nombre}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.tarea_tipo_nombre && formik.touched.tarea_tipo_nombre
									? "is-invalid" : "" )}
					  placeholder="Nombre para el tipo de tara"
					/>					
					<div>{(formik.errors.tarea_tipo_nombre) ? <p style={{color: 'red'}}>{formik.errors.tarea_tipo_nombre}</p> : null}</div>
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