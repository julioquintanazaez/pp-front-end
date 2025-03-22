import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';
import { BiBox } from 'react-icons/bi';   //< BiBox />

const ClienteEliminar = ( props ) => {
	
	const { token } = useContext(Context);
	const { setMessages, handleLogout } = useContext(Context);	
	
	
	const eliminarCliente = async (id) => {			
		
		await axios({
			method: 'delete',
			url: "/cliente/eliminar_cliente/" + id,			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Cliente eliminado satisfactoriamente" + Math.random());
				Swal.fire("Cliente eliminado satisfactoriament", "", "success");
				console.log("Cliente eliminado satisfactoriamente");	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});
	}
	
	const handleEliminarSubmit = (event) => {
		event.preventDefault();
		if (props.cliente.id_cliente != null){
			eliminarCliente(props.cliente.id_cliente);
		}else{
			Swal.fire("Seleccione un Cliente", "", "error");
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

export default ClienteEliminar;