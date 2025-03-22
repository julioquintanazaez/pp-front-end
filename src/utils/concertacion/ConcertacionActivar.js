import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import Swal from 'sweetalert2';

const ConcertacionActivar = ( props ) => {
	
	const { token } = useContext(Context);
	const { setMessages, handleLogout } = useContext(Context);	
	
	
	const activarConcertacion = async (id) => {			
		
		await axios({
			method: 'put',
			url: "/concertacion/activar_concertacion/" + id,	
			data: {
				conc_activa : props.concertacion.conc_activa ? false : true
			},
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {				
				setMessages("Concertacion activada satisfactoriamente" + Math.random());
				Swal.fire("Concertacion activada satisfactoriamente", "", "success");
				console.log("Concertacion activada satisfactoriamente");	
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});
	}
	
	const handleActivarSubmit = (event) => {
		event.preventDefault();
		if (props.concertacion.id_conc_tema != null){
			activarConcertacion(props.concertacion.id_conc_tema);
		}else{
			Swal.fire("Seleccione un concertacion", "", "error");
		}
	}
	
	if(props.concertacion.conc_activa == true){
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

export default ConcertacionActivar;