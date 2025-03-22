import React, {useState, useEffect, useContext} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { BiKey } from 'react-icons/bi';


export default function ResetUserPasswordModal( props ) {
	
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	const { token, setMessages, handleLogout } = useContext(Context);	
	
	const actualizarContrasenna = async () => {
		console.log(props.selecteduser.usuario),
		await axios({			
			method: 'put',
			url: "/usuario/actualizar_contrasenna/" + props.selecteduser.usuario,
			data:{
				newpassword: formik.values.newpassword
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				console.log({"Response ": response.data});
				setMessages("User password updated successfully" + Math.random());
				Swal.fire("Contraseña actualizada satisfatoriamente", "", "success");
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
		if (props.selecteduser.usuario != null){		
			setShow(true);  
		}else{
			Swal.fire("Por favor seleccione un usuario", "", "error");
		}
	}
	
	const validationRules = Yup.object().shape({	
		newpassword: Yup.string().trim()
			.required("Se requiere introduzca una contraseña para el usuario")
			.min(8, "Su contraseña es muy corta"),
		newpassword_confirm: Yup.string().trim()
			.oneOf([Yup.ref("newpassword"), null], "La contraseña debe coincidir")
			.required("Confirme su contraseña para el usuario")	
	});
	
	const registerInitialValues = {
		hashed_password: "",
		hashed_password_confirm: ""
	};

	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Actualizando cotraseña de usuario...")
			actualizarContrasenna();
			formik.resetForm();
			handleClose();
		},
		validationSchema: validationRules
	});
	
	
	return (
		<>
		<button className="btn btn-sm btn-primary" onClick={handleShow}>
			< BiKey />
		</button>
		<Modal show={show} onHide={handleClose} size="lm" > 
			<Modal.Header closeButton>
				<Modal.Title>
					Actualizar contraseña
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				
				<form className="form-control" onSubmit={formik.handleSubmit}>							
					<div className="form-group mt-3" id="newpassword">
						<label>Introduzca una contrasña para el usuario</label>
						<input
						  type="password"
						  name="newpassword"
						  value={formik.values.newpassword}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.newpassword && formik.touched.newpassword
										? "is-invalid" : "" )}
						  placeholder="Contrasña del usuario"
						/>					
						<div>{(formik.errors.newpassword) ? <p style={{color: 'red'}}>{formik.errors.newpassword}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="newpassword_confirm">
						<label>Confirme su contraseña para el usuario</label>
						<input
						  type="password"
						  name="newpassword_confirm"
						  value={formik.values.newpassword_confirm}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.newpassword_confirm && formik.touched.newpassword_confirm
										? "is-invalid" : "" )}
						  placeholder="Re introdizca su contraseña de usuario"
						/>					
						<div>{(formik.errors.newpassword_confirm) ? <p style={{color: 'red'}}>{formik.errors.newpassword_confirm}</p> : null}</div>
					</div>		
					<div className="d-grid gap-2 mt-3">
						<button type="submit" className="btn btn-success">
								Modificar
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