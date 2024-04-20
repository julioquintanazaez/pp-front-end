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
								{ value: "Ninguno", label: "Ninguno" },
								{ value: "Basico", label: "Basico" },
								{ value: "Medio", label: "Medio" },
								{ value: "Alto", label: "Alto" }
							];	
	
	//date.toISOString().split('T')[0],
	const adicionarEntidad = async () => {
		
		await axios({
			method: 'post',
			url: '/crear_entidad_origen/',
			data: {
				org_nombre: formik.values.org_nombre,
				org_siglas: formik.values.org_siglas,
				org_nivel_tecnologico: formik.values.org_nivel_tecnologico,
				org_transporte: formik.values.org_transporte,
				org_trab_remoto: formik.values.org_trab_remoto				
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
		org_nombre: Yup.string().trim()
			.required("Se requiere el nombre de la entidad"),
			//.test("Solo letras", "Introduzca letras", isNameOnly),
		org_siglas: Yup.string().trim()	
			.min(2, "Las siglas deben contener m�s de 3 letras")
			.max(25, "Las siglas no exceder las 25 letras")
			.required("Se requiere introduzca las siglas de la de la entidad"),
			//.test("Solo letras may�sculas y n�meros", "Introduzca letras may�sculas y num�ricos", siglasOnly),
		org_nivel_tecnologico: Yup.string().trim()	
			.required("Se requiere seleccione una opci�n"),
		org_transporte: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opci�n")
			.required("Se requiere marque una opci�n"),
		org_trab_remoto: Yup.boolean()
			.oneOf([true, false], "Por favor seleccione ona opci�n")
			.required("Se requiere marque una opci�n"),	
	});
	
	const registerInitialValues = {
		org_nombre: "",
		org_siglas: "",
		org_nivel_tecnologico: nivel_tecno_options[0]["value"],
		org_transporte: false,
		org_trab_remoto: false		
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
				<div className="form-group mt-3" id="org_nombre">
					<label>Introduzca el nombre de la entidad origen</label>
					<input
					  type="text"
					  name="org_nombre"
					  value={formik.values.org_nombre}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.org_nombre && formik.touched.org_nombre
									? "is-invalid" : "" )}
					  placeholder="Nombre de entidad (ej. Universidad de Ciego de �vila M�ximo G�mez B�ez)"
					/>					
					<div>{(formik.errors.org_nombre) ? <p style={{color: 'red'}}>{formik.errors.org_nombre}</p> : null}</div>
				</div>
				<div className="form-group mt-3">
					<label>Introduzca las siglas para la entidad origen</label>
					<input
					  type="text"
					  name="org_siglas"
					  value={formik.values.org_siglas}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.org_siglas && formik.touched.org_siglas
									? "is-invalid" : "" )}
					  placeholder="Siglas para la entidad origen (ej.UNICA)"
					/>					
					<div>{(formik.errors.org_siglas) ? <p style={{color: 'red'}}>{formik.errors.org_siglas}</p> : null}</div>
				</div>				
				<div className="form-group mt-3">
					<label>Seleccione el nivel tecnol�gico de la entidad</label>
					<select
					  type="text"
					  name="org_nivel_tecnologico"
					  value={formik.values.org_nivel_tecnologico}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.org_nivel_tecnologico && formik.touched.org_nivel_tecnologico
									? "is-invalid" : "" )
								}					  
					>
						{RenderOptions(nivel_tecno_options)} 
					</select>
					<div>{(formik.errors.org_nivel_tecnologico) ? <p style={{color: 'red'}}>{formik.errors.org_nivel_tecnologico}</p> : null}</div>
				</div>				
				<div className="form-group mt-3">			
					<label>Marque la opci�n correcta para el transporte en la entidad</label>
					<br/>
					<label>Tiene transporte (Si): </label>
					<input
					  type="radio"
					  name="org_transporte"
					  value={true}
					  onChange={formik.getFieldProps("org_transporte").onChange}
					  //{...formik.getFieldProps("org_transporte")}					  
					/>	
					<br/>
					<label>No tiene transporte (No): </label>
					<input
					  type="radio"
					  name="org_transporte"
					  value={false}
					  onChange={formik.getFieldProps("org_transporte").onChange}
					  //{...formik.getFieldProps("org_transporte")}					  
					/>			
				</div>			
				<div className="form-group mt-3">			
					<label>Marque la opci�n correcta para la posibilidad de trabajo remoto en la entidad</label>
					<br/>
					<label>Puede trabajar remoto (Si): </label>
					<input
					  type="radio"
					  name="org_trab_remoto"
					  value={true}
					  onChange={formik.getFieldProps("org_trab_remoto").onChange}
					  //{...formik.getFieldProps("org_trab_remoto")}					  
					/>	
					<br/>
					<label>No puede trabajar remoto (No): </label>
					<input
					  type="radio"
					  name="org_trab_remoto"
					  value={false}
					  onChange={formik.getFieldProps("org_trab_remoto").onChange}
					  //{...formik.getFieldProps("org_trab_remoto")}					  
					/>			
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