import React, {useState, useEffect, useContext} from 'react';
import { useNavigate, useLocation } from "react-router";
import { Context } from './../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import Navigation from './../components/MainNavbar.js'; 
import * as Yup from "yup";
import { useFormik } from "formik";

function Login () {
	
	const navigate = useNavigate();
	const location = useLocation();

	const { isLoggedIn, setToken, setIsLoggedIn, handleLogout } = useContext(Context);
	 
	const authenticate_user = async () => {
		 
		const form_data = new FormData();
		form_data.append("username",  formik.values.username);
		form_data.append("password", formik.values.password);		
		
		await axios({
			method: 'post',
			url: '/token/',                         
			data: form_data
		}).then(response => {
			if (response.status === 200) {				
				const dataUser = {
					access_token: response.data.access_token,
					token_type: response.data.token_type
				};
				console.log({"Respuesta de autenticacion": formik.values.username});
				setToken(response.data.access_token);
				setIsLoggedIn(true);
				const origin = location.state?.from?.pathname || '/admin'; 
				navigate(origin);
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});	
			Swal.fire("Access denied!", error.response.data.detail, "error");
			navigate("/");
		});		
	}	
	
	const signOut = () => {	
		navigate("/");
	}
	
	const validationRules = Yup.object().shape({
		username: Yup.string().trim()	
			.min(3, "Password must be 3 characters at minimum")
			.max(15, "Password must be 15 characters at maximum")
			.required("Username is required"),
		password: Yup.string()
			.min(3, "Password must be 3 characters at minimum")
			.required("Password is required"),
	});
	
	const registerInitialValues = {
		username: '',
		password: ''
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,		
		onSubmit: (data) => {
			console.log(data.username);
			authenticate_user();
			formik.resetForm();
		},
		validationSchema: validationRules,
	});

	return (  		
		<div className="Auth-form-container" >
			<div className="container-fluid-md">			
				<div className="row">				
					<div className="col-sm">					
						<Navigation />	
					</div>
				</div>				
			</div>
			<br/>	
			<br/>	
			
				<form className="Auth-form" onSubmit={formik.handleSubmit}>
					<div className="Auth-form-content">
						<label> Usuario </label>
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
						</div><br/>
						<label> Contraseña </label>
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
							  placeholder="Introduzca su contraseña"
							/>
							<div>{(formik.errors.password) ? <p style={{color: 'red'}}>{formik.errors.password}</p> : null}</div>
						</div>
						<div className="d-grid gap-2 mt-3">
							<button type="submit" className="btn btn-success">
									Acceder						
							</button>					
						</div>		
					
					</div>
				</form>	
			
		</div>
		
	);
	
}

export default Login;