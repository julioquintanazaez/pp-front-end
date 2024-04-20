import './App.css';
import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Context } from './context/Context';
import { ProtectedRoute } from './context/ProtectedRoute';

import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Admin from './pages/Admin.js';
import Entidad_Origen from './pages/Entidad_Origen.js';
import Entidad_Destino from './pages/Entidad_Destino.js';
import Profesor from './pages/Profesor.js';
import Cliente from './pages/Cliente.js';
import Estudiante from './pages/Estudiante.js';
import Concertacion from './pages/Concertacion.js';
import TipoTarea from './pages/TipoTarea.js';
import Asignacion from './pages/Asignacion.js';
import Actividades from './pages/Actividades.js';
import ActualizarTarea from './pages/ActualizarTarea.js';

const App = () => {	
	
	const { isLoggedIn, isAdmin } = useContext(Context);
	
	return (
		<div>							
			<Routes>
				<Route index element={<Home />} />
				<Route path="/" element={<Home />} />					
				<Route path="/login" element={<Login />} />	
				<Route element={<ProtectedRoute isAllowed={ isLoggedIn && isAdmin } />}>
					<Route path="/admin" element={<Admin />} />
					<Route path="/entidadorigen" element={<Entidad_Origen />} />	
					<Route path="/entidaddestino" element={<Entidad_Destino />} />
					<Route path="/profesor" element={<Profesor />} />	
					<Route path="/cliente" element={<Cliente />} />	
					<Route path="/estudiante" element={<Estudiante />} />
					<Route path="/concertacion" element={<Concertacion />} />
					<Route path="/tipotarea" element={<TipoTarea />} />
					<Route path="/asignacion" element={<Asignacion />} />
					<Route path="/actividades" element={<Actividades />} />	
					<Route path="/actualizartarea" element={<ActualizarTarea />} />	
				</Route>				
				<Route path="*" element={<p>There's nothing here: 404!</p>} />
			</Routes>						
		</div>
	);
}

export default App;