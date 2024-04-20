import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';

const ActividadesEliminar = ( props ) => {
	
	const { token } = useContext(Context);
	const { setMessages, handleLogout } = useContext(Context);	
	
	
	const eliminarActividad = async (id) => {			
		
		await axios({
			method: 'delete',
			url: "/eliminar_actividad_tarea/" + id,			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Actividad eliminada satisfactoriamente" + Math.random());
				Swal.fire("Actividad eliminada satisfactoriament", "", "success");
				console.log("Actividad eliminada satisfactoriamente");	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});
	}
	
	const handleEliminarSubmit = (event) => {
		event.preventDefault();
		if (props.actividad.id_actividad_tarea != null){
			eliminarActividad(props.actividad.id_actividad_tarea);
		}else{
			Swal.fire("Seleccione un actividad", "", "error");
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

export default ActividadesEliminar;