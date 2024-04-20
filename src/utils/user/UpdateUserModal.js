import React, {useState, useEffect, useContext} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { BiArchiveOut } from 'react-icons/bi';

export default function UpdateUserModal( props ) {
	
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);
	const { token, setMessages, handleLogout } = useContext(Context);	
	
	const admin = ["admin","profesor","cliente","estudiante","usuario"];
	const profesor = ["profesor","usuario"];
	const cliente = ["cliente","usuario"];
	const estudiante = ["estudiante","usuario"];
	const usuario = ["usuario"];
	
	const roles_de_usuario = [
				{ value: "admin-profesor-cliente-estudiante-usuario", label: "admin" },
				{ value: "profesor-usuario", label: "profesor" },
				{ value: "cliente-usuario", label: "cliente" },
				{ value: "estudiante-usuario", label: "estudiante" },
				{ value: "usuario", label: "usuario" }
			];	
			
	const actualizarUsuario = async (username) => {
		
		await axios({
			method: 'put',
			url: "/update_user/" + username,
			data: {
					nombre: formik.values.nombre,
					primer_appellido: formik.values.primer_appellido,
					segundo_appellido: formik.values.segundo_appellido,
					ci: formik.values.ci,
					email: formik.values.email,				
					role: formik.values.role.split("-"),	
					},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				console.log("User updated successfuly");	
				setMessages("User updated successfuly" + Math.random());
				Swal.fire("Usuario actualizado satisfatoriamente", "", "success");
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
		if (props.selecteduser.username != null){		
			setShow(true);  
		}else{
			Swal.fire("Por favor seleccione un usuario", "", "error");
		}
	}
	
	const validationRules = Yup.object().shape({	
		nombre: Yup.string().trim()
			.required("Se requiere el nombre para el usuario"),
		primer_appellido: Yup.string().trim()
			.required("Se requiere el 1er apellido para el usuario"),
		segundo_appellido: Yup.string().trim()
			.required("Se requiere el 2do apellido para el usuario"),
		ci: Yup.string().trim()
			.required("Se requiere número de identidad del usuario"),
		email: Yup.string().trim()
			.required("Se requiere el correo para el usuario"),
		role: Yup.string().trim()
			.required("Se requiere el role para el usuario")					
	});
	
	const registerInitialValues = {
		nombre: props.selecteduser.nombre,
		primer_appellido: props.selecteduser.primer_appellido,
		segundo_appellido: props.selecteduser.segundo_appellido,
		ci: props.selecteduser.ci,
		email: props.selecteduser.email,
		role: props.selecteduser.role.toString().replace(",", "-") //"usuario"
	};

	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Actualizando usuario...")
			console.log(values)
			actualizarUsuario(props.selecteduser.username);
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
	
	return (
		<>
		<button className="btn btn-sm btn-primary" onClick={handleShow}>
			< BiArchiveOut />
		</button>
		<Modal show={show} onHide={handleClose} size="lm" > 
			<Modal.Header closeButton>
				<Modal.Title>
					Actualizar {props.selecteduser.username}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
			
				<form className="form-control" onSubmit={formik.handleSubmit}>
					<div className="form-group mt-3" id="nombre">
						<label>Introduzca el nombre de usuario</label>
						<input
						  type="text"
						  name="nombre"
						  value={formik.values.nombre}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.nombre && formik.touched.nombre
										? "is-invalid" : "" )}
						  placeholder="Nombre de usuario (ej. Juan)"
						/>					
						<div>{(formik.errors.nombre) ? <p style={{color: 'red'}}>{formik.errors.nombre}</p> : null}</div>
					</div>
					<div className="form-group mt-3" id="primer_appellido">
						<label>Introduzca el primer apellido del usuario</label>
						<input
						  type="text"
						  name="primer_appellido"
						  value={formik.values.primer_appellido}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.primer_appellido && formik.touched.primer_appellido
										? "is-invalid" : "" )}
						  placeholder="Primer apellido del estudiante"
						/>					
						<div>{(formik.errors.primer_appellido) ? <p style={{color: 'red'}}>{formik.errors.primer_appellido}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="segundo_appellido">
						<label>Introduzca el segundo apellido del usuario</label>
						<input
						  type="text"
						  name="segundo_appellido"
						  value={formik.values.segundo_appellido}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.segundo_appellido && formik.touched.segundo_appellido
										? "is-invalid" : "" )}
						  placeholder="Segundo apellido del usuario"
						/>					
						<div>{(formik.errors.segundo_appellido) ? <p style={{color: 'red'}}>{formik.errors.segundo_appellido}</p> : null}</div>
					</div>		
					<div className="form-group mt-3" id="ci">
						<label>Introduzca el número de identidad del usuario</label>
						<input
						  type="text"
						  name="ci"
						  value={formik.values.ci}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.ci && formik.touched.ci
										? "is-invalid" : "" )}
						  placeholder="CI del usuario"
						/>					
						<div>{(formik.errors.ci) ? <p style={{color: 'red'}}>{formik.errors.ci}</p> : null}</div>
					</div>	
					<div className="form-group mt-3" id="email">
						<label>Introduzca el correo(@) electrónico del usuario</label>
						<input
						  type="text"
						  name="email"
						  value={formik.values.email}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.email && formik.touched.email
										? "is-invalid" : "" )}
						  placeholder="nombre@gmail.com"
						/>					
						<div>{(formik.errors.email) ? <p style={{color: 'red'}}>{formik.errors.email}</p> : null}</div>
					</div>
					<div className="form-group mt-3" id="role">
						<label>Seleccione el role a desempeñar para el usuario del sistema</label>
						<select
						  type="text"
						  name="role"
						  value={formik.values.role}
						  onChange={formik.handleChange}
						  onBlur={formik.handleBlur}
						  className={"form-control mt-1" + 
										(formik.errors.role && formik.touched.role
										? "is-invalid" : "" )
									}>
							{RenderOptions(roles_de_usuario)} 
						</select>
						<div>{(formik.errors.role) ? <p style={{color: 'red'}}>{formik.errors.role}</p> : null}</div>
					</div>	
					<div className="d-grid gap-2 mt-3">
						<button type="submit" className="btn btn-success">
								Modificar datos
						</button>					
					</div>		
				</form>
				
			
			</Modal.Body>
			<Modal.Footer>		
				<Button className="btn-sm" variant="secondary" onClick={handleClose}>
					Close
				</Button>	  
			</Modal.Footer>
			</Modal>
		</>
	);
}