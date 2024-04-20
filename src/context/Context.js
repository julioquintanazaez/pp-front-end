import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import axios from 'axios';

export const Context = React.createContext();

export const ContextProvider = ({ children }) => {
	
	const navigate = useNavigate();
	const location = useLocation();
	
	const [token, setToken] = useState(window.localStorage.getItem("QUESTTIONARIES_APP_TOKEN_2024")); 
	const [user, setUser] = useState({});
	const [authroles, setAuthRoles] = useState([]);
	const [isAdmin, setIsAdmin] = useState(false);
	const [isManager, setIsManager] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [messages, setMessages] = useState("");	
	
	
	const handleLogout = () => {
		setToken("");
		setUser({});
		setIsLoggedIn(false);
		setIsAdmin(false);
		setAuthRoles([])
		window.localStorage.removeItem("PP_APP_TOKEN_2024");
		navigate('/');
	}
	
	useEffect(()=> {
		if (token){	
			try {
				window.localStorage.setItem("PP_APP_TOKEN_2024", token);	
				handleGetCurrentUser();
			}catch(err){}
		}else{
			try {
				window.localStorage.removeItem("PP_APP_TOKEN_2024");
			}catch(err){}
		}
	}, [token]);	
	
	const handleGetCurrentUser = async () => {
		
		await axios({
			method: 'get',
			url: '/get_user_status/',                         
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,  
			},
		}).then(response => {
			if (response.status === 200) {				
				setUser(response.data);	
				setIsLoggedIn(true);
				setAuthRoles(response.data.role);
				handleRole(response.data.role);
				console.log("Update data from current user");
				setMessages("User logged-in successfully" + Math.random());				
			}else {	
				console.log("Registration Failed from context, please try again");				
				handleLogout();		
			}
		}).catch((error) => {
			handleLogout();
		});			
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
