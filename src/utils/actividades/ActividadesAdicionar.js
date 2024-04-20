import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect, useContext} from "react";
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ActividadesAdicionar ( ) {
	
	const [validated, setValidated] = useState(false);
	const { setMessages, token } = useContext(Context);
	const [asignaciones, setAsignaciones] = useState([]);	
	
	const adicionarActividad = async () => {
		
		await axios({
			method: 'post',
			url: '/crear_actividad_tarea/',
			data: {
				act_nombre: formik.values.act_nombre,
				act_est_memo: formik.values.act_est_memo,
				act_prof_memo: formik.values.act_prof_memo,
				act_cli_memo: formik.values.act_cli_memo,
				id_asg_act: formik.values.id_asg_act				
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Actividad creada"+ Math.random());
				Swal.fire("Actividad creada exitosamente", "", "success");
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
		});				  
	}
  
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({		
		act_nombre: Yup.string().trim()
			.required("Se requiere el nombre para la actividad"),
		act_est_memo: Yup.string().trim()
			.required("Se requiere la estrategia del estudiante para la actividad"),
		act_prof_memo: Yup.string().trim()
			.required("Se requiere la estrategia del profesor para la actividad"),
		act_cli_memo: Yup.string().trim()
			.required("Se requiere la estrategia del cliente para la actividad"),
		id_asg_act: Yup.string().trim()
			.required("Se requiere la asignación para la actividad")				
	});
	
	const registerInitialValues = {
		act_nombre : "",
		act_est_memo : "",
		act_prof_memo : "",
		act_cli_memo : "",
		id_asg_act : ""			
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Guardar datos...")
			console.log(values)
			adicionarActividad();
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
				<div className="form-group mt-3" id="act_nombre">
					<label>Introduzca el nombre para la actividad</label>
					<input
					  type="text"
					  name="act_nombre"
					  value={formik.values.act_nombre}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.act_nombre && formik.touched.act_nombre
									? "is-invalid" : "" )}
					  placeholder="Nombre para la actividad"
					/>					
					<div>{(formik.errors.act_nombre) ? <p style={{color: 'red'}}>{formik.errors.act_nombre}</p> : null}</div>
				</div>				
				<div className="form-group mt-3" id="act_est_memo">
					<label>Introduzca la estrategia del estudiante para desarrollar la actividad</label>
					<textarea
					  rows="2"
					  name="act_est_memo"
					  value={formik.values.act_est_memo}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.act_est_memo && formik.touched.act_est_memo
									? "is-invalid" : "" )}
					  placeholder="Estrategia del estudiante"
					>
					</textarea>
					<div>{(formik.errors.act_est_memo) ? <p style={{color: 'red'}}>{formik.errors.act_est_memo}</p> : null}</div>
				</div>	
				<div className="form-group mt-3" id="act_prof_memo">
					<label>Introduzca la estrategia del profesor para desarrollar la actividad</label>
					<textarea
					  rows="2"
					  name="act_prof_memo"
					  value={formik.values.act_prof_memo}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.act_prof_memo && formik.touched.act_prof_memo
									? "is-invalid" : "" )}
					  placeholder="Estrategia para el profesor"
					>
					</textarea>
					<div>{(formik.errors.act_prof_memo) ? <p style={{color: 'red'}}>{formik.errors.act_prof_memo}</p> : null}</div>
				</div>	
				<div className="form-group mt-3" id="asg_participantes">
					<label>Introduzca la estrategia del cliente para desarrollar la actividad</label>
					<textarea
					  rows="2"
					  name="act_cli_memo"
					  value={formik.values.act_cli_memo}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.act_cli_memo && formik.touched.act_cli_memo
									? "is-invalid" : "" )}
					  placeholder="Estrategia para el cliente"
					>
					</textarea>
					<div>{(formik.errors.act_cli_memo) ? <p style={{color: 'red'}}>{formik.errors.act_cli_memo}</p> : null}</div>
				</div>	
				<div className="form-group mt-3" id="id_asg_act">
					<label>Seleccione la asignación para la actividad</label>
					<select
					  type="text"
					  name="id_asg_act"
					  value={formik.values.id_asg_act}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.id_asg_act && formik.touched.id_asg_act
									? "is-invalid" : "" )
								}>
						<option value="" label="Seleccione una opcion">Seleccione una opción</option>	
						{RenderAsignaciones()} 
					</select>
					<div>{(formik.errors.id_asg_act) ? <p style={{color: 'red'}}>{formik.errors.id_asg_act}</p> : null}</div>
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