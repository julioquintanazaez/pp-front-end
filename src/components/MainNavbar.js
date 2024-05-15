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
	const { user, isAdmin, isLoggedIn, authroles } = useContext(Context);
	
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
							{isAdmin && 
							<NavDropdown title="Gestión de Recursos" id="recursos">	
								<NavDropdown.Item>
									<LinkContainer to="/entidadorigen">
										<Nav.Link>Entidad Origen</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>
								<NavDropdown.Item>
									<LinkContainer to="/entidaddestino">
										<Nav.Link>Entidad Cliente</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>
								<NavDropdown.Item>
									<LinkContainer to="/profesor">
										<Nav.Link>Profesor</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>
								<NavDropdown.Item>
									<LinkContainer to="/cliente">
										<Nav.Link>Cliente</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>
								<NavDropdown.Item>
									<LinkContainer to="/estudiante">
										<Nav.Link>Estudiante</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>
							</NavDropdown>
							}
							{isAdmin && 
							<NavDropdown title="Gestión de Actividades" id="gestion">	
								<NavDropdown.Item>
									<LinkContainer to="/concertacion">
										<Nav.Link>Concertación de Tema</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>
								<NavDropdown.Item>
									<LinkContainer to="/tipotarea">
										<Nav.Link>Tipo de Tareas</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>
								<NavDropdown.Item>
									<LinkContainer to="/asignacion">
										<Nav.Link>Asignación de Tareas</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>
								<NavDropdown.Item>
									<LinkContainer to="/actividades">
										<Nav.Link>Actividades de Tareas</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>
								<NavDropdown.Item>
									<LinkContainer to="/actualizartarea">
										<Nav.Link>Actualización de Tareas</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>
							</NavDropdown>
							}
							{authroles.includes('profesor') && !isAdmin &&
							<NavDropdown title="Profesor" id="profesor">									
								<NavDropdown.Item>
									<LinkContainer to="/profesorgestor">
										<Nav.Link>Cosas profesor</Nav.Link>
									</LinkContainer>									
								</NavDropdown.Item>	
							</NavDropdown >								
							}
							{authroles.includes('cliente') && !isAdmin  &&
							<NavDropdown title="Cliente" id="cliente">									
								<NavDropdown.Item>
									<LinkContainer to="/clientegestor">
										<Nav.Link>Cosas clientes</Nav.Link>
									</LinkContainer>									
								</NavDropdown.Item>	
							</NavDropdown >								
							}
							{authroles.includes('estudiante') && !isAdmin  &&
							<NavDropdown title="Estudiante" id="estudiante">									
								<NavDropdown.Item>
									<LinkContainer to="/estudiantegestor">
										<Nav.Link>Cosas estudiante</Nav.Link>
									</LinkContainer>									
								</NavDropdown.Item>	
							</NavDropdown >								
							}
							{isAdmin && 
							<NavDropdown title="Panel Administrador" id="adminstrador">									
								<NavDropdown.Item>
									<LinkContainer to="/admin">
										<Nav.Link>Gestión de usuarios</Nav.Link>
									</LinkContainer>									
								</NavDropdown.Item>	
							</NavDropdown >
							}												
						</Nav>	
						<Nav className="justify-content-end">
							<NavDropdown title="Sistema" id="basic-nav-dropdown">
							{!isLoggedIn
								?
								<NavDropdown.Item as="button">
									<LinkContainer to="/login">
										<Nav.Link>Autenticarse</Nav.Link>
									</LinkContainer>
								</NavDropdown.Item>
								:								
								<NavDropdown.Item as="button" onClick={logoutUser}>
									Salir
								</NavDropdown.Item>								
							}
							</NavDropdown>
						</Nav>
						
					</Navbar.Collapse>
				</Container>
			</Navbar>
		</>		
	);
}

export default Navigation