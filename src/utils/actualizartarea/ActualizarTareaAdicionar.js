import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect, useContext} from "react";
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ActualizarTareaAdicionar ( ) {
	
	const [validated, setValidated] = useState(false);
	const { setMessages, token } = useContext(Context);
	const [asignaciones, setAsignaciones] = useState([]);	
	
	const adicionarActualizarTarea = async () => {
		
		await axios({
			method: 'post',
			url: '/crear_actualizacion_tarea/',
			data: {
				memo_actualizacion: formik.values.memo_actualizacion,
				id_asg_upd: formik.values.id_asg_upd				
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Actualización de asignación creada"+ Math.random());
				Swal.fire("Actualización de asignación creada exitosamente", "", "success");
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
		});				  
	}
  
	const validationRules = Yup.object().shape({		
		memo_actualizacion: Yup.string().trim()
			.required("Se requiere el nombre para la actividad"),
		id_asg_upd: Yup.string().trim()
			.required("Se requiere la asignación para la actividad")				
	});
	
	const registerInitialValues = {
		memo_actualizacion : "",
		id_asg_upd : ""			
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Guardar datos...")
			console.log(values)
			adicionarActualizarTarea();
			formik.resetForm();
		},
		validationSchema: validationRules
	});
	
	useEffect(()=> {
        leerAsignaciones();
    }, []);	
	
	const leerAsignaciones = async () => {
		
		await axios({
			method: 'get',
			url: '/leer_asgignaciones_tareas/',			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {	
				setAsignaciones(response.data);
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});				  
	};
	
	const RenderAsignaciones = () => {
		return (			
			asignaciones.map(item => 
				<option value={item.id_asignacion} label={item.asg_descripcion}> 
					{item.asg_descripcion}
				</option>				
			) 
		)
	};	
	
	return (
		<>
			<form className="form-control" onSubmit={formik.handleSubmit}>
				<div className="form-group mt-3" id="memo_actualizacion">
					<label>Introduzca la descripción para la actualización de la asignación</label>
					<textarea
					  rows="3"
					  name="memo_actualizacion"
					  value={formik.values.memo_actualizacion}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.memo_actualizacion && formik.touched.memo_actualizacion
									? "is-invalid" : "" )}
					  placeholder="Memo descriptivo para la actialización de la asignación"
					>	
					</textarea>
					<div>{(formik.errors.memo_actualizacion) ? <p style={{color: 'red'}}>{formik.errors.memo_actualizacion}</p> : null}</div>
				</div>						
				<div className="form-group mt-3" id="id_asg_upd">
					<label>Seleccione la asignación de actividad para insertar actualización</label>
					<select
					  type="text"
					  name="id_asg_upd"
					  value={formik.values.id_asg_upd}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.id_asg_upd && formik.touched.id_asg_upd
									? "is-invalid" : "" )
								}>
						<option value="" label="Seleccione una opcion">Seleccione una opción</option>	
						{RenderAsignaciones()} 
					</select>
					<div>{(formik.errors.id_asg_upd) ? <p style={{color: 'red'}}>{formik.errors.id_asg_upd}</p> : null}</div>
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