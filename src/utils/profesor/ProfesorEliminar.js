import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BiBox } from 'react-icons/bi';   //< BiBox />

const ProfesorEliminar = ( props ) => {
	
	const { token } = useContext(Context);
	const { setMessages, handleLogout } = useContext(Context);	
	
	
	const eliminarProfesor = async (id) => {			
		
		await axios({
			method: 'delete',
			url: "/profesor/eliminar_profesor/" + id,			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Profesor eliminado satisfactoriamente" + Math.random());
				Swal.fire("Profesor eliminado satisfactoriament", "", "success");
				console.log("Profesor eliminado satisfactoriamente");	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});
	}
	
	const handleEliminarSubmit = (event) => {
		event.preventDefault();
		if (props.profesor.id_profesor != null){
			eliminarProfesor(props.profesor.id_profesor);
		}else{
			Swal.fire("Seleccione un profesor", "", "error");
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

export default ProfesorEliminar;