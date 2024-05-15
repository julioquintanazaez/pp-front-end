import React, { useEffect, useRef, useState, useContext } from 'react';
import { Context } from "../context/Context";
import axios from 'axios'; 

export default function useLoadActividades( props ){
	
	const {token, user, messages} = useContext(Context);
	const [actividades, setActividades] = useState({});	
	
	useEffect(() => {
		
		const fetchActividades = async () =>{
			await axios({
				method: 'get',
				url: '/leer_actividades_tareas_asignacion/' + props.id,                         
				headers: {
					'accept': 'application/json',
					'Authorization': "Bearer " + token,  
				},
			}).then(response => {
				if (response.status === 201) {
					console.log("Datos de actividades leidos");					
					setEstudiante(response.data);
					console.log({"Datos de actvidades desde el hook": response.data});
				}else {	
					setEstudiante({});
				}
			}).catch((error) => {
				console.error({"message":error.message, "detail":error.response.data.detail});
			});		
		};		
		
		fetchActividades();
		
	}, []);
	
	return actividades;
};