import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from '../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';

const AsignacionActivar = ( props ) => {
	
	const { token } = useContext(Context);
	const { setMessages, handleLogout } = useContext(Context);	
	
	
	const activarAsignacion = async (id) => {			
		
		await axios({
			method: 'put',
			url: "/activar_asignacion_tarea/" + id,	
			data: {
				asg_activa : props.asignacion.asg_activa ? false : true
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Asignacion activada satisfactoriamente" + Math.random());
				Swal.fire("Asignacion activada satisfactoriamente", "", "success");
				console.log("Asignacion activada satisfactoriamente");	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});
	}
	
	const handleActivarSubmit = (event) => {
		event.preventDefault();
		if (props.asignacion.id_asignacion != null){
			activarAsignacion(props.asignacion.id_asignacion);
		}else{
			Swal.fire("Seleccione un asignacion", "", "error");
		}
	}
	
	if(props.asignacion.asg_activa == true){
		return (	
			<>			
				<button type="submit" 
						className="btn btn-sm btn-success"
						onClick={(e) => handleActivarSubmit(e)} > 
						Descativar
				</button>
			</>
		);
	}
	return (	
		<>			
			<button type="submit" 
					className="btn btn-sm btn-secondary"
					onClick={(e) => handleActivarSubmit(e)} > 
					Activar
			</button>
		</>
	);

}

export default AsignacionActivar;