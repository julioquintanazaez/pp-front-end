import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect, useContext} from "react";
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";

export default function EntidadOrigenAdicionar ( ) {
	
	const [validated, setValidated] = useState(false);
	const { setMessages, token } = useContext(Context);
	
	//Options configurations
	const nivel_tecno_options = [
								{ value: "Ninguna", label: "Ninguna" },
								{ value: "Basica", label: "Básica" },
								{ value: "Media", label: "Media" },
								{ value: "Alta", label: "Alta" }
							];	
	
	//date.toISOString().split('T')[0],
	const adicionarEntidad = async () => {
		
		await axios({
			method: 'post',
			url: '/universidad/crear_universidad/',
			data: {
				universidad_nombre: formik.values.universidad_nombre,
				universidad_siglas: formik.values.universidad_siglas,
				universidad_tec: formik.values.universidad_tec,
				universidad_transp: formik.values.universidad_transp,
				universidad_teletrab: formik.values.universidad_teletrab				
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Entidad creado"+ Math.random());
				Swal.fire("Entidad Origen creada exitosamente", "", "success");
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
		});				  
	}
  
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({
		universidad_nombre: Yup.string().trim()
			.required("Se requiere el nombre de la entidad"),
			//.test("Solo letras", "Introduzca letras", isNameOnly),
		universidad_siglas: Yup.string().trim()	
			.min(2, "Las siglas deben contener m�s de 3 letras")
			.max(25, "Las siglas no exceder las 25 letras")
			.required("Se requiere introduzca las siglas de la de la entidad"),
			//.test("Solo letras mayúsculas y números", "Introduzca letras mayúsculas y numúricos", siglasOnly),
		universidad_tec: Yup.string().trim()	
			.required("Se requiere seleccione una opción"),
		universidad_transp: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opción")
			.required("Se requiere marque una opción"),
		universidad_teletrab: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opción")
			.required("Se requiere marque una opción"),	
	});
	
	const registerInitialValues = {
		universidad_nombre: "",
		universidad_siglas: "",
		universidad_tec: nivel_tecno_options[0]["value"],
		universidad_transp: false,
		universidad_teletrab: false		
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Save data...")
			console.log(values)
			adicionarEntidad();
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

	const handleRadioTransporte = e => formik.values.radioButtonValue = e.target.value
	
	const handleRadioTeleTrab = e => formik.values.radioButtonValue = e.target.value
	
	return (
		<>
			<form className="form-control" onSubmit={formik.handleSubmit}>
				<div className="form-group mt-3" id="universidad_nombre">
					<label>Introduzca el nombre de la entidad origen</label>
					<input
					  type="text"
					  name="universidad_nombre"
					  value={formik.values.universidad_nombre}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.universidad_nombre && formik.touched.universidad_nombre
									? "is-invalid" : "" )}
					  placeholder="Nombre de entidad (ej. Universidad de Ciego de Ávila Máximo Gómez Báez)"
					/>					
					<div>{(formik.errors.universidad_nombre) ? <p style={{color: 'red'}}>{formik.errors.universidad_nombre}</p> : null}</div>
				</div>
				<div className="form-group mt-3" id="universidad_siglas"> 
					<label>Introduzca las siglas para la entidad origen</label>
					<input
					  type="text"
					  name="universidad_siglas"
					  value={formik.values.universidad_siglas}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.universidad_siglas && formik.touched.universidad_siglas
									? "is-invalid" : "" )}
					  placeholder="Siglas para la entidad origen (ej.UNICA)"
					/>					
					<div>{(formik.errors.universidad_siglas) ? <p style={{color: 'red'}}>{formik.errors.universidad_siglas}</p> : null}</div>
				</div>				
				<div className="form-group mt-3" id="universidad_tec">
					<label>Seleccione el nivel tecnológico de la entidad</label>
					<select
					  type="text"
					  name="universidad_tec"
					  value={formik.values.universidad_tec}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.universidad_tec && formik.touched.universidad_tec
									? "is-invalid" : "" )
								}					  
					>
						{RenderOptions(nivel_tecno_options)} 
					</select>
					<div>{(formik.errors.org_nivel_tecnologico) ? <p style={{color: 'red'}}>{formik.errors.org_nivel_tecnologico}</p> : null}</div>
				</div>				
				<div className="form-group mt-3" id="universidad_transp">			
					<label>Marque la opción correcta para el transporte en la entidad</label>
					<br/>
					<label>Tiene transporte (Si): </label>
					<input
					  type="radio"
					  name="universidad_transp"
					  value={true}
					  onChange={formik.getFieldProps("universidad_transp").onChange}
					  //{...formik.getFieldProps("org_transporte")}					  
					/>	
					<br/>
					<label>No tiene transporte (No): </label>
					<input
					  type="radio"
					  name="universidad_transp"
					  value={false}
					  onChange={formik.getFieldProps("universidad_transp").onChange}
					  //{...formik.getFieldProps("org_transporte")}					  
					/>			
				</div>			
				<div className="form-group mt-3" id="universidad_teletrab">			
					<label>Marque la opción correcta para la posibilidad de trabajo remoto en la entidad</label>
					<br/>
					<label>Puede trabajar remoto (Si): </label>
					<input
					  type="radio"
					  name="universidad_teletrab"
					  value={true}
					  onChange={formik.getFieldProps("universidad_teletrab").onChange}
					  //{...formik.getFieldProps("org_trab_remoto")}					  
					/>	
					<br/>
					<label>No puede trabajar remoto (No): </label>
					<input
					  type="radio"
					  name="universidad_teletrab"
					  value={false}
					  onChange={formik.getFieldProps("universidad_teletrab").onChange}
					  //{...formik.getFieldProps("org_trab_remoto")}					  
					/>			
				</div>			
				<div className="d-grid gap-2 mt-3">
					<button type="submit" className="btn btn-success">
							Guardar
					</button>					
				</div>		
			</form>
		</>
	);
}