import './../App.css';
import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { Context } from './../context/Context';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from "react-router-bootstrap";


const Navigation = ( props ) => {
	
	const { handleLogout } = useContext(Context);
	const { user, isLoggedIn, authroles } = useContext(Context);
	
	const logoutUser = () => {
		handleLogout();
	};
	
	return (
		<>
			<Navbar expand="lg" fixed="top" className="navbar-light" bg="bg-dark" data-bs-theme="dark">
				<Container>
					<Navbar.Brand href="/">
						Prácticas Profesionales
					</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse className="justify-content-end">
						<Nav className="me-auto" activeKey={window.location.pathname}>							
							{authroles.includes('admin') && 
							<NavDropdown title="Gestión de Recursos" id="recursos">	
								<NavDropdown.Item>
									<LinkContainer to="/universidades">
										<Nav.Link>Universidades</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>	
								<NavDropdown.Item>
									<LinkContainer to="/centroslaborales">
										<Nav.Link>Centros laborales</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>	
								<NavDropdown.Item>
									<LinkContainer to="/profesores">
										<Nav.Link>Profesores</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>
								<NavDropdown.Item>
									<LinkContainer to="/clientes">
										<Nav.Link>Clientes</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>
								<NavDropdown.Item>
									<LinkContainer to="/estudiantes">
										<Nav.Link>Estudiantes</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>
							</NavDropdown>
							}
							{authroles.includes('admin') && 
							<NavDropdown title="Gestión de Actividades" id="gestion">	
								<NavDropdown.Item>
									<LinkContainer to="/concertacion">
										<Nav.Link>Concertación de Temas</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>	
								<NavDropdown.Item>
									<LinkContainer to="/asignaciontarea">
										<Nav.Link>Asignación de Tareas</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>
							</NavDropdown>
							}
							{authroles.includes('admin') && 
							<NavDropdown title="Usuarios" id="adminstrador">									
								<NavDropdown.Item>
									<LinkContainer to="/admin">
										<Nav.Link>Usuarios del sistema</Nav.Link>
									</LinkContainer>									
								</NavDropdown.Item>	
							</NavDropdown >
							}	
							{authroles.includes('profesor') && !authroles.includes('admin') &&
							<NavDropdown title="Profesor" id="profesor">									
								<NavDropdown.Item>
									<LinkContainer to="/profesorgestor">
										<Nav.Link>Profesor</Nav.Link>
									</LinkContainer>									
								</NavDropdown.Item>	
							</NavDropdown >								
							}
							{authroles.includes('cliente') && !authroles.includes('admin')  &&
							<NavDropdown title="Cliente" id="cliente">									
								<NavDropdown.Item>
									<LinkContainer to="/clientegestor">
										<Nav.Link>Clientes</Nav.Link>
									</LinkContainer>									
								</NavDropdown.Item>	
							</NavDropdown >								
							}
							{authroles.includes('estudiante') && !authroles.includes('admin')  &&
							<NavDropdown title="Estudiante" id="estudiante">									
								<NavDropdown.Item>
									<LinkContainer to="/estudiantegestor">
										<Nav.Link>Estudiante</Nav.Link>
									</LinkContainer>									
								</NavDropdown.Item>	
							</NavDropdown >								
							}
						</Nav>	
						<Nav className="justify-content-end">
						{isLoggedIn && (
							<NavDropdown title={user.email} id="basic-nav-dropdown">	
								<NavDropdown.Item as="button" onClick={logoutUser}>
									Salir
								</NavDropdown.Item>	
							</NavDropdown>
						)}
						</Nav>						
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>		
	);
}

export default Navigation