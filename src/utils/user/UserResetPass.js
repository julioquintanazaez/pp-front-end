import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";

const UserResetPass = (props) => {
	
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	const { token, setMessages, handleLogout } = useContext(Context);	
	
	const actualizarContrasenna = async () => {
		
		await axios({
			method: 'put',
			url: "/reset_password/" + props.selecteduser.username,
			data:{
				hashed_password: formik.values.hashed_password
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				console.log({"Response ": response.data});
				setMessages("User password updated successfully" + Math.random());
				Swal.fire("Contrase�a actualizada satisfatoriamente", "", "success");
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});				  
	}
	
	const validationRules = Yup.object().shape({	
		hashed_password: Yup.string()
			.min(5, "Password debe contener al menos 3 caracteres")
			.required("Se requiere el password").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*[\]{}()?"\\,><':;|_~`=+-])[a-zA-Z\d!@#$%^&*[\]{}()?"\\,><':;|_~`=+-]{12,99}$/,
					'Debe contener al menos 5 caracteres, 1 may�scula, 1 min�scila, 1 caracter especial, y 1 n�mero'),
		hashed_password_confirm: Yup.string().trim()
			.oneOf([Yup.ref("hashed_password")])
			.required("Confirme su contrase�a para el usuario")	
	});
	
	const registerInitialValues = {
		hashed_password: "",
		hashed_password_confirm: ""
	};

	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Actualizando cotrasenna de usuario...")
			actualizarContrasenna();
			formik.resetForm();
		},
		validationSchema: validationRules
	});
		
	return (
		<>
			<form className="form-control" onSubmit={formik.handleSubmit}>							
				<div className="form-group mt-3" id="hashed_password">
					<label>Introduzca una contrase�a para el usuario</label>
					<input
					  type="password"
					  name="hashed_password"
					  value={formik.values.hashed_password}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.hashed_password && formik.touched.hashed_password
									? "is-invalid" : "" )}
					  placeholder="Contrase�a del usuario"
					/>					
					<div>{(formik.errors.hashed_password) ? <p style={{color: 'red'}}>{formik.errors.hashed_password}</p> : null}</div>
				</div>		
				<div className="form-group mt-3" id="hashed_password_confirm">
					<label>Confirme su contrase�a para el usuario</label>
					<input
					  type="password"
					  name="hashed_password_confirm"
					  value={formik.values.hashed_password_confirm}
					  onChange={formik.handleChange}
					  onBlur={formik.handleBlur}
					  className={"form-control mt-1" + 
									(formik.errors.hashed_password_confirm && formik.touched.hashed_password_confirm
									? "is-invalid" : "" )}
					  placeholder="Re introdizca su contrase�a de usuario"
					/>					
					<div>{(formik.errors.hashed_password_confirm) ? <p style={{color: 'red'}}>{formik.errors.hashed_password_confirm}</p> : null}</div>
				</div>		
				<div className="d-grid gap-2 mt-3">
					<button type="submit" className="btn btn-success">
							Modificar datos
					</button>					
				</div>		
			</form>
		</>
	);	
	
}

export default UserResetPass;