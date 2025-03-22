import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from 'axios';

export const Context = React.createContext();

export const ContextProvider = ({ children }) => {
	
	const navigate = useNavigate();
	const location = useLocation();
	
	const [token, setToken] = useState(window.localStorage.getItem("PRACTICAS_APP_TOKEN")); 
	const [user, setUser] = useState({});
	const [authroles, setAuthRoles] = useState([]);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isManager, setIsManager] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [messages, setMessages] = useState("");	
	
	
	useEffect(()=> {
		
		const fetchGetCurrentUser = async () => {
			console.log("Fetching user credential with token variable.........")
			await axios({
				method: 'get',
				url: '/users/me/',                         
				headers: {
					'accept': 'application/json',
					'Authorization': "Bearer " + token,  
				},
			}).then(response => {
				if (response.status === 200) {			
					console.log("Acceso al sistema exitoso :)");
					setUser(response.data);	
					setIsLoggedIn(true);
					setAuthRoles(response.data.role);
					handleRole(response.data.role);		
					window.localStorage.setItem("PRACTICAS_APP_TOKEN", token);	
				}else {	
					console.log("No existe el token");
					setToken(null); 
					window.localStorage.removeItem("PRACTICAS_APP_TOKEN");								
					handleLogout();		
				}
			}).catch((error) => {
				console.error({"message":error.message, "detail":error.response.data.detail});
				handleLogout();
			});			
		}
		
		fetchGetCurrentUser();
		
	}, [token]);	
	
	const handleLogout = () => {
		setToken(null);
		setUser({});
		setIsLoggedIn(false);
		setIsAdmin(false);
		setAuthRoles([])
		window.localStorage.removeItem("PRACTICAS_APP_TOKEN");
		//navigate('/');
	}
	
	const handleRole = (role) => {	
		if (role.includes('admin')){
			setIsAdmin(true);				
		}	
	}
	
	return (
		<Context.Provider value={{
							token, setToken,
							user, setUser, authroles,
							isLoggedIn, setIsLoggedIn,
							handleLogout, isAdmin,
							messages, setMessages
						 }}>
			{children}
		</Context.Provider>
	);
};
