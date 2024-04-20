import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';

const TipoTareaEliminar = ( props ) => {
	
	const { token } = useContext(Context);
	const { setMessages, handleLogout } = useContext(Context);	
	
	
	const eliminarTipoTarea = async (id) => {			
		
		await axios({
			method: 'delete',
			url: "/eliminar_tipo_tarea/" + id,			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Tipo de Tarea eliminado satisfactoriamente" + Math.random());
				Swal.fire("Tipo de Tarea eliminado satisfactoriament", "", "success");
				console.log("Tipo de Tarea eliminado satisfactoriamente");	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});
	}
	
	const handleEliminarSubmit = (event) => {
		event.preventDefault();
		if (props.tipotarea.id_tipo_tarea != null){
			eliminarTipoTarea(props.tipotarea.id_tipo_tarea);
		}else{
			Swal.fire("Seleccione un tipo de tarea", "", "error");
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

export default TipoTareaEliminar;