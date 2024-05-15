import React, { useEffect, useRef, useState, useContext } from 'react';
import { Context } from "../context/Context";
import axios from 'axios'; 

export default function useLoadEstudiante( props ){
	
	const {token, user, messages} = useContext(Context);
	const [estudiante, setEstudiante] = useState({});	
	
	useEffect(() => {
		
		const fetchEstudiante = async () =>{
			await axios({
				method: 'get',
				url: '/leer_asgignacion_estudiante/' + user.email,                         
				headers: {
					'accept': 'application/json',
					'Authorization': "Bearer " + token,  
				},
			}).then(response => {
				if (response.status === 201) {
					console.log("Datos del estudiante leidos");					
					setEstudiante(response.data);
					console.log({"Datos del hook": response.data});
				}else {	
					setEstudiante({});
				}
			}).catch((error) => {
				console.error({"message":error.message, "detail":error.response.data.detail});
			});		
		};		
		
		fetchEstudiante();
		
	}, []);
	
	return estudiante;
};