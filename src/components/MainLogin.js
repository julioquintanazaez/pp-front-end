import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from "react-router";
import { Context } from "../context/Context";
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";

const MainLogin = () =>{
	
	const {token, setToken} = useContext(Context);
	
	const autenticar_usuario = async () =>{
		
		const form_data = new FormData();
		form_data.append("username",  formik.values.username);
		form_data.append("password", formik.values.password);	
		
		await axios({
			method: 'post',
			url: '/token/',  
			header: {'Content-Type': 'application/x-www-form-urlencoded'},
			data: form_data,			
		}).then(response => {
			if (response.status === 200) {						
				setToken(response.data.access_token);
				console.log(window.localStorage.getItem("PP_APP_TOKEN_2024"));
			}
			else{
				setErrorMessage(response.data);
				window.localStorage.removeItem("PP_APP_TOKEN_2024");
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			Swal.fire("Acceso denegado!", error.response.data.detail, "error");
			window.localStorage.removeItem("PP_APP_TOKEN_2024");
		});	 		
	};	
	
	const validationRules = Yup.object().shape({
		username: Yup.string().trim()	
			.min(4, "Nombre de usuario debe contener al más de 3 caracteres")
			.max(15, "Nombre de usuario debe contener a lo máximo 15 caracteres")
			.required("Se requiere el nombre de usuario"),
		password: Yup.string()
			.min(5, "Password debe contener al menos 3 caracteres")
			.required("Se requiere el password").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*[\]{}()?"\\,><':;|_~`=+-])[a-zA-Z\d!@#$%^&*[\]{}()?"\\,><':;|_~`=+-]{12,99}$/,
					'Debe contener al menos 5 caracteres, 1 mayúscula, 1 minúscila, 1 caracter especial, y 1 número'),
	});
	
	const registerInitialValues = {
		username: '',
		password: ''
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,		
		onSubmit: (data) => {
			console.log("Enviando datos...");
			autenticar_usuario();
			formik.resetForm();
		},
		validationSchema: validationRules,
	});
	
	return (
		<>
		{!token && (
			<div className="Auth-form-container" >
				<div className="container-fluid-md">
					<br/>
					<br/>					
					<form className="Auth-form" onSubmit={formik.handleSubmit}>
						<div className="Auth-form-content">
							<h1 className="title">Autenticarse</h1>					
							<label className="label">Usuario</label>
							<div className="form-group mt-3">
								<input
								  type="text"
								  name="username"
								  value={formik.values.username}
								  onChange={formik.handleChange}
								  onBlur={formik.handleBlur}
								  className={"form-control mt-1" + 
												(formik.errors.username && formik.touched.username
												? "is-invalid"
												: ""
											)}
								  placeholder="Introduzca su nombre de usuario"
								/>
								<div>{(formik.errors.username) ? <p style={{color: 'red'}}>{formik.errors.username}</p> : null}</div>
							</div>
							<label className="label">Password</label>
							<div className="form-group mt-3">
								<input
								  type="password"
								  name="password"
								  value={formik.values.password}
								  onChange={formik.handleChange}
								  onBlur={formik.handleBlur}
								  className={"form-control mt-1" + 
												(formik.errors.password && formik.touched.password
												? "is-invalid"
												: ""
											)}
								  placeholder="Introduzca su password"
								/>
								<div>{(formik.errors.password) ? <p style={{color: 'red'}}>{formik.errors.password}</p> : null}</div>
							</div>
							<div className="d-grid gap-2 mt-3">
								<button className="btn btn-success" type="submit">
									Entrar
								</button>
							</div>	
						</div>
					</form>		
				</div>
			</div>
		)}	
		</>
	);
};

export default MainLogin;
