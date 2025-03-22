import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from '../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';

const AsignacionEliminar = ( props ) => {
	
	const { token } = useContext(Context);
	const { setMessages, handleLogout } = useContext(Context);	
	
	
	const eliminarAsignacion = async (id) => {			
		
		await axios({
			method: 'delete',
			url: "/tarea/eliminar_tarea/" + id,			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Tarea eliminada satisfactoriamente" + Math.random());
				Swal.fire("Tarea eliminada satisfactoriament", "", "success");
				console.log("Tarea eliminada satisfactoriamente");	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});
	}
	
	const handleEliminarSubmit = (event) => {
		event.preventDefault();
		if (props.asignacion.id_tarea != null){
			eliminarAsignacion(props.asignacion.id_tarea);
		}else{
			Swal.fire("Seleccione una tarea", "", "error");
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

export default AsignacionEliminar;