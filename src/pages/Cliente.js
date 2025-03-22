import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../context/Context';
import Navigation from './../components/MainNavbar.js'; 

import ClienteAdicionarModal from './../utils/cliente/ClienteAdicionarModal.js';
import ClienteTabla from './../utils/cliente/ClienteTabla.js';

const Cliente = () => {
	
	const { setToken, setUser, token } = useContext(Context);
		
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
							< ClienteTabla />
						</div>
					</div>
				</div><br/>
				<div className="row gx-5">
					<div className="col">
						<div className="p-3 border bg-light">					
							< ClienteAdicionarModal />
						</div>
					</div>
				</div>
			</div>
		</div>			
		
	);
}

export default Cliente;
