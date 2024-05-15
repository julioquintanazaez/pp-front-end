import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../context/Context';
import { useNavigate } from "react-router";
import { Outlet, Link } from 'react-router-dom';
import Navigation from './../components/MainNavbar.js'; 
import axios from 'axios'; 

import EstudianteAsignacion from './../utils/estudiante/EstudianteAsignacion.js';
import ActividadesEstudianteTabla from './../utils/actividades/ActividadesEstudianteTabla.js';
import useLoadEstudiante from "./../hooks/useLoadEstudiante";
import useLoadActividades from "./../hooks/useLoadActividades";


const EstudianteGestor = () => {
	
	const { setToken, user, token } = useContext(Context);	
	const estudiante = useLoadEstudiante();
	
	const [actividades, setActividades] = useState([]);	
	
	const fetchActividades = async (id) =>{
		await axios({
			method: 'get',
			url: '/leer_actividades_tareas_asignacion/' + id,                         
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,  
			},
		}).then(response => {
			if (response.status === 201) {
				setActividades(response.data);
				console.log({"Datos de actvidades": response.data});
			}else {	
				setActividades([]);
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
		});		
	};		
	
	useEffect(() => {
		console.log({"Dentro del useeffect": estudiante.id_asignacion})
		fetchActividades(estudiante.id_asignacion);
	}, []);
	
	console.log(actividades);
	
	return (		
		<div className="container-fluid-md">			
			<div className="row">				
				<div className="col-sm">					
					<Navigation />												
				</div>
			</div>
			<br/>	
			<br/>	
			<div className="container overflow-hidden"><br/>				
				<div className="row gx-5">
					<div className="col">
						<div className="p-3 border bg-light">					
							< EstudianteAsignacion usuario={user} />
						</div>
					</div>
				</div>
				<br/>
				<div className="row gx-5">
					<div className="col">
						<div className="p-3 border bg-light">					
							<h1>{estudiante.id_asignacion}</h1>
						</div>
					</div>
				</div>
			</div>
		</div>	
	);
}

export default EstudianteGestor;
