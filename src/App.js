import './App.css';
import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Context } from './context/Context';
import { ProtectedRoute } from './context/ProtectedRoute';

import Home from './pages/Home.js';
import Admin from './pages/Admin.js';
import Entidad_Origen from './pages/Entidad_Origen.js';
import Entidad_Destino from './pages/Entidad_Destino.js';
import Profesor from './pages/Profesor.js';
import Cliente from './pages/Cliente.js';
import Estudiante from './pages/Estudiante.js';
import Concertacion from './pages/Concertacion.js';
import Asignacion from './pages/Asignacion.js';
//Vistas particulares
import ProfesorGestor from './pages/ProfesorGestor.js';
import ClienteGestor from './pages/ClienteGestor.js';
import EstudianteGestor from './pages/EstudianteGestor.js';

import MainLogin from "./components/MainLogin";
import MainNavbar from "./components/MainNavbar";

const App = () => {	
	
	const { isLoggedIn, authroles, token, currentuser } = useContext(Context);
	
	return (
		<>
			<MainNavbar />
			<MainLogin />
			{token && (		
				<div className="columns">							
					<Routes>
						<Route index element={<Home />} />
						<Route path="/" element={<Home />} />					
						<Route element={<ProtectedRoute isAllowed={ isLoggedIn && authroles.includes('admin') } />}>
							<Route path="/admin" element={<Admin />} />
							<Route path="/universidades" element={<Entidad_Origen />} />	
							<Route path="/centroslaborales" element={<Entidad_Destino />} />
							<Route path="/profesores" element={<Profesor />} />	
							<Route path="/clientes" element={<Cliente />} />	
							<Route path="/estudiantes" element={<Estudiante />} />
							<Route path="/concertacion" element={<Concertacion />} />
							<Route path="/asignaciontarea" element={<Asignacion />} />
						</Route>		
						<Route element={<ProtectedRoute isAllowed={ isLoggedIn && authroles.includes('profesor')} />}>					
							<Route path="/profesorgestor" element={<ProfesorGestor />} />	
						</Route>	
						<Route element={<ProtectedRoute isAllowed={ isLoggedIn && authroles.includes('cliente')} />}>					
							<Route path="/clientegestor" element={<ClienteGestor />} />	
						</Route>	
						<Route element={<ProtectedRoute isAllowed={ isLoggedIn && authroles.includes('estudiante')} />}>					
							<Route path="/estudiantegestor" element={<EstudianteGestor />} />	
						</Route>	
						<Route path="*" element={<p>There's nothing here: 404!</p>} />
					</Routes>						
				</div>
			)}
		</>
	);
}

export default App;