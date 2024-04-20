import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';

const ActualizarTareaEliminar = ( props ) => {
	
	const { token } = useContext(Context);
	const { setMessages, handleLogout } = useContext(Context);	
	
	
	const eliminarActualizarTarea = async (id) => {			
		
		await axios({
			method: 'delete',
			url: "/eliminar_actualizacion_tarea/" + id,			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Actualización eliminada satisfactoriamente" + Math.random());
				Swal.fire("Actualización eliminada satisfactoriament", "", "success");
				console.log("Actualización eliminada satisfactoriamente");	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});
	}
	
	const handleEliminarSubmit = (event) => {
		event.preventDefault();
		if (props.actualizartarea.id_tareas_act != null){
			eliminarActualizarTarea(props.actualizartarea.id_tareas_act);
		}else{
			Swal.fire("Seleccione una actualización de tarea", "", "error");
		}
	}
	
	return (	
		<>			
			<button type="submit" 
					className="btn btn-sm btn-danger"
					onClick={(e) => handleEliminarSubmit(e)} > 
					Eliminar
			</button>
		</>
	);
}

export default ActualizarTareaEliminar;