import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../context/Context';
import { useNavigate } from "react-router";
import { Outlet, Link } from 'react-router-dom';
import Navigation from './../components/MainNavbar.js'; 
import axios from 'axios'; 

import EstudianteAsignacion from './../utils/estudiante/EstudianteAsignacion.js';
import ActividadesEstudianteTabla from './../utils/actividades/ActividadesEstudianteTabla.js';


const EstudianteGestor = () => {
	
	const { setToken, user, token } = useContext(Context);	
	
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
							< ActividadesEstudianteTabla />
						</div>
					</div>
				</div>
			</div>
		</div>	
	);
}

export default EstudianteGestor;
