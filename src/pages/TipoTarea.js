import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../context/Context';
import { useNavigate } from "react-router";
import { Outlet, Link } from 'react-router-dom';
import Navigation from './../components/MainNavbar.js'; 

import TipoTareaAdicionar from './../utils/tipotarea/TipoTareaAdicionar.js';
import TipoTareaTabla from './../utils/tipotarea/TipoTareaTabla.js';

const TipoTarea = () => {
	
	const { setToken, setUser, token } = useContext(Context);
	const navigate = useNavigate();
	
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
							< TipoTareaAdicionar />
						</div>
					</div>
				</div><br/>
				<div className="row gx-5">
					<div className="col">
						<div className="p-3 border bg-light">					
							< TipoTareaTabla />
						</div>
					</div>
				</div>
			</div>
		</div>			
		
	);
}

export default TipoTarea;
