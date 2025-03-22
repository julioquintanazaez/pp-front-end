import React, {useState, useEffect, useContext} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from "yup";
import { useFormik } from "formik";

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';


export default function EntidadDestinoAdicionarModal( props ) {
	
	const { token, setMessages, handleLogout } = useContext(Context);
	const [show, setShow] = useState(false);
	const [validated, setValidated] = useState(false);	
	
	//Options configurations
	const nivel_tecno_options = [
								{ value: "Ninguno", label: "Ninguno" },
								{ value: "Basico", label: "Basico" },
								{ value: "Medio", label: "Medio" },
								{ value: "Alto", label: "Alto" }
							];	
							
	const adicionarEntidad = async () => {
		
		await axios({
			method: 'post',
			url: '/centro/crear_centropracticas/',
			data: {
				centro_nombre: formik.values.centro_nombre,
				centro_siglas: formik.values.centro_siglas,
				centro_tec: formik.values.centro_tec,
				centro_transp: formik.values.centro_transp,
				centro_experiencia: formik.values.centro_experiencia,
				centro_teletrab: formik.values.centro_teletrab
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Centro laboral"+ Math.random());
				Swal.fire("Centro laboral creada exitosamente", "", "success");
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
		});				  
	}
  
	const handleClose = () => {
		setShow(false);
	}
	
	const handleShow = () => {
        setShow(true);		
	}
	
	const digitsOnly = (value) => /^\d+$/.test(value) //--:/^[0-9]d+$/
	const siglasOnly = (value) => /[^A-Z]|[^0-9]d+$/.test(value) 
	const isNameOnly = (value) => /[^A-Za-z]$/.test(value) 
	
	const validationRules = Yup.object().shape({
        centro_nombre: Yup.string().trim()
            .required("Se requiere el nombre del centro"),
            //.test("Solo letras", "Introduzca letras", isNameOnly),
        centro_siglas: Yup.string().trim()	
            .min(2, "Las siglas deben contener más de 3 letras")
            .max(25, "Las siglas no exceder las 25 letras")
            .required("Se requiere introduzca las siglas del centro"),
            //.test("Solo letras may�sculas y n�meros", "Introduzca letras may�sculas y num�ricos", siglasOnly),
        centro_tec: Yup.string().trim()	
            .required("Se requiere seleccione una opción"),
        centro_transp: Yup.boolean()
            .oneOf([true, false], "Por favor seleccione una opción")
            .required("Se requiere marque una opción"),
        centro_experiencia: Yup.boolean()
            .oneOf([true, false], "Por favor seleccione una opción")
            .required("Se requiere marque una opción"),	
        centro_teletrab: Yup.boolean()
            .oneOf([true, false], "Por favor seleccione una opción")
            .required("Se requiere marque una opción"),	
    });
	
	const registerInitialValues = {
		centro_nombre: "",
		centro_siglas: "",
		centro_tec: nivel_tecno_options[0]["value"],
		centro_transp: false,
		centro_experiencia: false,
		centro_teletrab: false		
	};
	
	const formik = useFormik({
		initialValues: registerInitialValues,
		onSubmit: (values) => {
			console.log("Change data...")
			console.log(values)
			adicionarEntidad();
			formik.resetForm();
            handleClose();
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
		<button className="btn btn-sm btn-success" onClick={handleShow}>
			Adicionar 
		</button>
		<Modal show={show} onHide={handleClose} size="lm" > 
			<Modal.Header closeButton>
				<Modal.Title>
					Adicionar
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
                <form className="form-control" onSubmit={formik.handleSubmit}>
                    <div className="form-group mt-3" id="centro_nombre">
                        <label>Introduzca el nombre del centro </label>
                        <input
                        type="text"
                        name="centro_nombre"
                        value={formik.values.centro_nombre}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={"form-control mt-1" + 
                                        (formik.errors.centro_nombre && formik.touched.centro_nombre
                                        ? "is-invalid" : "" )}
                        placeholder="Nombre de entidad (ej. Laboratorio de software)"
                        />					
                        <div>{(formik.errors.centro_nombre) ? <p style={{color: 'red'}}>{formik.errors.centro_nombre}</p> : null}</div>
                    </div>
                    <div className="form-group mt-3" id="centro_siglas">
                        <label>Introduzca las siglas para en centro de prácticas</label>
                        <input
                        type="text"
                        name="centro_siglas"
                        value={formik.values.centro_siglas}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={"form-control mt-1" + 
                                        (formik.errors.centro_siglas && formik.touched.centro_siglas
                                        ? "is-invalid" : "" )}
                        placeholder="Siglas para el centro (ej. Desarrollo Info)"
                        />					
                        <div>{(formik.errors.centro_siglas) ? <p style={{color: 'red'}}>{formik.errors.centro_siglas}</p> : null}</div>
                    </div>				
                    <div className="form-group mt-3" id="centro_tec">
                        <label>Seleccione el nivel de tecnología de la entidad</label>
                        <select
                        type="text"
                        name="centro_tec"
                        value={formik.values.centro_tec}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={"form-control mt-1" + 
                                        (formik.errors.centro_tec && formik.touched.centro_tec
                                        ? "is-invalid" : "" )
                                    }					  
                        >
                            {RenderOptions(nivel_tecno_options)} 
                        </select>
                        <div>{(formik.errors.centro_tec) ? <p style={{color: 'red'}}>{formik.errors.centro_tec}</p> : null}</div>
                    </div>				
                    <div className="form-group mt-3" id="centro_transp">			
                        <label>Marque la opción correcta para el transporte</label>
                        <br/>
                        <label>Tiene transporte (Si): </label>
                        <input
                        type="radio"
                        name="centro_transp"
                        value={true}
                        onChange={formik.getFieldProps("centro_transp").onChange}	  
                        />	
                        <br/>
                        <label>Tiene transporte (No): </label>
                        <input
                        type="radio"
                        name="centro_transp"
                        value={false}
                        onChange={formik.getFieldProps("centro_transp").onChange}	  
                        />			
                    </div>			
                    <div className="form-group mt-3" id="centro_experiencia">			
                        <label>Marque la opción correcta para la posibilidad de trabajo remoto</label>
                        <br/>
                        <label>Puede trabajar remoto (Si): </label>
                        <input
                        type="radio"
                        name="centro_experiencia"
                        value={true}
                        onChange={formik.getFieldProps("centro_experiencia").onChange}	  
                        />	
                        <br/>
                        <label>Puede trabajar remoto (No): </label>
                        <input
                        type="radio"
                        name="centro_experiencia"
                        value={false}
                        onChange={formik.getFieldProps("centro_experiencia").onChange}	  
                        />			
                    </div>		
                    <div className="form-group mt-3" id="centro_teletrab">			
                        <label>Marque la opción correcta para la experiencia</label>
                        <br/>
                        <label>Tiene experiencia (Si): </label>
                        <input
                        type="radio"
                        name="centro_teletrab"
                        value={true}
                        onChange={formik.getFieldProps("centro_teletrab").onChange}  
                        />	
                        <br/>
                        <label>No tiene experiencia (No): </label>
                        <input
                        type="radio"
                        name="centro_teletrab"
                        value={false}
                        onChange={formik.getFieldProps("centro_teletrab").onChange}	  
                        />			
                    </div>		
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-success">
                                Guardar
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