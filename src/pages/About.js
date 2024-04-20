import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../context/Context';
import Navigation from './../components/MainNavbar.js'; 

const Contact = () => {
	
	const { setToken, setUser, token } = useContext(Context);
	
	return (
		<div className="Auth-form-container">
			<div className="container-fluid-md">			
				<div className="row">				
					<div className="col-sm">
					
						<Navigation />	
											
					</div>
				</div>
			</div>			
		</div>
	);
}

export default Contact;
