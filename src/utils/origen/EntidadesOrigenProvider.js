import 'bootstrap/dist/css/bootstrap.min.css';
import React, {useState, useEffect, useContext} from "react";
import axios from 'axios';

export const Context = React.createContext();

export const EntidadesOrigenProvider = ({ children }) => {
	
	const [entidadescontexto, setEntidadesContexto] = useState([]);
	const { messages, token, handleLogout } = useContext(Context);	
	
	useEffect(()=> {
        leerEntidades();
    }, [messages]);	
	
	const leerEntidades = async () => {
		
		await axios({
			method: 'get',
			url: '/leer_entidades_origen/',			
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {	
				setEntidadesContexto(response.data);
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});				  
	}
	
	return (
		<Context.Provider value={{ entidadescontexto }}>
			{children}
		</Context.Provider>
	);
};