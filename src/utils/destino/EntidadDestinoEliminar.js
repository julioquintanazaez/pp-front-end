import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';

const EntidadDestinoEliminar = ( props ) => {
	
	const { token } = useContext(Context);
	const { setMessages, handleLogout } = useContext(Context);	
	
	
	const eliminarEntidad = async (id) => {			
		
		await axios({
			method: 'delete',
			url: "/eliminar_entidad_destino/" + id,			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Entidad Destino eliminada satisfactoriamente" + Math.random());
				Swal.fire("Entidad Destino eliminada satisfactoriament", "", "success");
				console.log("Entidad Destino eliminada satisfactoriamente");	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});
	}
	
	const handleEliminarSubmit = (event) => {
		event.preventDefault();
		if (props.entidad.id_entidad_destino != null){
			eliminarEntidad(props.entidad.id_entidad_destino);
		}else{
			Swal.fire("Seleccione una entidad destino", "", "error");
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

export default EntidadDestinoEliminar;