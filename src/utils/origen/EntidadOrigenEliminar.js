import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';

const EntidadOrigenEliminar = ( props ) => {
	
	const { token } = useContext(Context);
	const { setMessages, handleLogout } = useContext(Context);	
	
	
	const eliminarEntidad = async (id) => {			
		
		await axios({
			method: 'delete',
			url: "/eliminar_entidad_origen/" + id,			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Entidad origen eliminada satisfactoriamente" + Math.random());
				Swal.fire("Entidad origen eliminada satisfactoriament", "", "success");
				console.log("Entidad origen eliminada satisfactoriamente");	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});
	}
	
	const handleEliminarSubmit = (event) => {
		event.preventDefault();
		if (props.entidad.id_entidad_origen != null){
			eliminarEntidad(props.entidad.id_entidad_origen);
		}else{
			Swal.fire("Seleccione una entidad", "", "error");
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

export default EntidadOrigenEliminar;