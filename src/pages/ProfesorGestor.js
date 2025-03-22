import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../context/Context';
import { useNavigate } from "react-router";
import { Outlet, Link } from 'react-router-dom';
import Navigation from './../components/MainNavbar.js'; 

import ProfesorTablaGestor from './../utils/profesor/ProfesorTablaGestor.js';
import ProfesorTablaAsignaciones from './../utils/profesor/ProfesorTablaAsignaciones.js';

const ProfesorGestor = () => {
	
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
							<h1>Mis concertaciones</h1>
							< ProfesorTablaGestor />
						</div>
					</div>
				</div>
				<br/>
				<div className="row gx-5">
					<div className="col">
						<div className="p-3 border bg-light">
							<h1>Mis tareas</h1>
							< ProfesorTablaAsignaciones />
						</div>
					</div>
				</div>
			</div>
		</div>	
	);
}

export default ProfesorGestor;
