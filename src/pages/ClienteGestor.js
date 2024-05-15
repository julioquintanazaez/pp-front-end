import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../context/Context';
import { useNavigate } from "react-router";
import { Outlet, Link } from 'react-router-dom';
import Navigation from './../components/MainNavbar.js'; 

import ClienteTablaGestor from './../utils/cliente/ClienteTablaGestor.js';
import ClienteTablaAsignaciones from './../utils/cliente/ClienteTablaAsignaciones.js';

const ClienteGestor = () => {
	
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
							< ClienteTablaGestor />
						</div>
					</div>
				</div>
				<br/>
				<div className="row gx-5">
					<div className="col">
						<div className="p-3 border bg-light">					
							< ClienteTablaAsignaciones usuario={user} />
						</div>
					</div>
				</div>
			</div>
		</div>	
	);
}

export default ClienteGestor;
