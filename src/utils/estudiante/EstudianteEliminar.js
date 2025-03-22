import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BiBox } from 'react-icons/bi';   //< BiBox />

const estudianteEliminar = ( props ) => {
	
	const { token } = useContext(Context);
	const { setMessages, handleLogout } = useContext(Context);	
	
	
	const eliminarEstudiante = async (id) => {			
		
		await axios({
			method: 'delete',
			url: "/estudiante/eliminar_estudiante/" + id,			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Estudiante eliminado satisfactoriamente" + Math.random());
				Swal.fire("Estudiante eliminado satisfactoriament", "", "success");
				console.log("Estudiante eliminado satisfactoriamente");	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});
	}
	
	const handleEliminarSubmit = (event) => {
		event.preventDefault();
		if (props.estudiante.id_estudiante != null){
			eliminarEstudiante(props.estudiante.id_estudiante);
		}else{
			Swal.fire("Seleccione un estudiante", "", "error");
		}
	}
	
	return (	
		<>			
			<button type="submit" 
					className="btn btn-sm btn-danger"
					onClick={(e) => handleEliminarSubmit(e)} > 
					< BiBox />
			</button>
		</>
	);
}

export default estudianteEliminar;