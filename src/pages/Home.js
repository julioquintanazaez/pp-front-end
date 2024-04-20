import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../context/Context';
import { useNavigate } from "react-router";
import { Outlet, Link } from 'react-router-dom';
import axios from 'axios';

//Components
import Navigation from './../components/MainNavbar.js'; 




const Home = () => {	

	//From CONTEXT
	const { token, messages, handleLogout } = useContext(Context);
	const { user, setUser } = useContext(Context);
	const { isLoggedIn, setIsLoggedIn } = useContext(Context);
	const { isAdmin } = useContext(Context);	
	
	
	return (
		
		<div className="container-fluid-md">			
			<div className="row">															
				<div className="col-sm">											
					<Navigation />											
				</div>
			</div><br/>	
			
			<div className="row">				
				<div className="col"><br/>					
					<div className="col">					
						<div className="container overflow-hidden"><br/>								
							<div className="row gx-5">
								<div className="col">
									<div className="p-3 border bg-light">
										
										
									</div>									
								</div>
							</div><br/>														
						</div>						
					</div>	
				</div>				
			</div>		
			
		</div>		
			
	);
  
}

export default Home;
