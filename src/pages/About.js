import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../context/Context';
import { useNavigate } from "react-router";
import { Outlet, Link } from 'react-router-dom';
import DashboardStyle from './../custom_styles/DashboardStyle.css';
import Navigation from './../components/MainNavbar.js'; 

const Contact = () => {
	
	const { setToken, setUser, token } = useContext(Context);
	const navigate = useNavigate();
	
	return (
		<div className="Auth-form-container" style={{ 
			backgroundImage: "url(/images/background4.jpg)",
			height: "100vh",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",			
			}}
		>
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

export default Contact
