import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React, {useState, useEffect, useContext} from 'react';
import { Context } from './../../context/Context';
import axios from 'axios';
import { Table } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { BiLike } from 'react-icons/bi';
import { BiBox } from 'react-icons/bi';

import ResetUserPasswordModal from './../user/ResetUserPasswordModal.js';
import UpdateUserModal from './../user/UpdateUserModal.js';

const UserTable = (props) => {

	const { token, user, messages, setMessages, handleLogout } = useContext(Context);
    const [users, setUsers] = useState([]); 	
	
	useEffect(()=> {
        fetchUsers();
    }, [messages]);
		
	const fetchUsers = async () => {
		
		await axios({
			method: 'get',
			url: '/usuario/leer_usuarios/',
			headers: {
				'accept': 'application/json',
				'Authorization': "Bearer " + token,
			},
		}).then(response => {
			if (response.status === 201) {
				console.log({"Response ": response.data});	
				setUsers(response.data);
				console.log({"Loaded users to Table successfuly ":users});						
			}
		}).catch((error) => {
			console.error({"message":error.message, "detail":error.response.data.detail});
			handleLogout();
		});			  
	}
	
	const deleteUser = async (usuario) => {		
		if (usuario !== ""){
			if (usuario != user.usuario){
				await axios({
					method: 'delete',
					url: "/usuario/eliminar_usuario/" + usuario,			
					headers: {
						'accept': 'application/json',
						'Authorization': "Bearer " + token,
					},
				}).then(response => {
					if (response.status === 201) {
						setMessages("User deleted successfuly" + Math.random());
						Swal.fire("Usuario eliminado satisfatoriamente", "", "success");
					}
				}).catch((error) => {
					console.error({"message":error.message, "detail":error.response.data.detail});
					handleLogout();
				});
			}else{
				Swal.fire("Usted no puede eliminar su propio usuario", "", "error");
			}
		}else{
			Swal.fire("Seleccione un usuario", "", "error");
		}
	}	
	
	const activateUser = async (user_item) => {		
		if (user_item.usuario != null){
			await axios({
				method: 'put',
				url: "/usuario/activar_usuario/" + user_item.usuario,
				data: {
					deshabilitado: user_item.deshabilitado ? false : true						
						},
				headers: {
					'accept': 'application/json',
					'Authorization': "Bearer " + token,
				},
			}).then(response => {
				if (response.status === 201) {
					setMessages("User activated successfuly" + Math.random());
					Swal.fire("Usuario activado satisfatoriamente", "", "success");
				}
			}).catch((error) => {
				console.error({"message":error.message, "detail":error.response.data.detail});
				handleLogout();
			});		
		}else{
			Swal.fire("Seleccione un usuario", "", "error");
		}			
	}
	
	const buttonClassActivate = async (user_item) => {
		if (user_item.deshabilitado){
			return "btn-danger";
		}
		return "btn btn-sm btn-success";
	}
	
	const renderTableData = () => {
		return users?.map((user_item, index) => (
				<tr className="row-md" key={user_item.usuario}>
					<th scope="row">{index + 1}</th>
					<td>{user_item.usuario}</td>
					<td>{user_item.nombre}</td>
					<td>{user_item.primer_appellido}</td>
					<td>{user_item.segundo_appellido}</td>
					<td>{user_item.ci}</td>
					<td>{user_item.email}</td>
					<td>{user_item.role[0]}</td>
					<td>{user_item.deshabilitado ? "No Activo" : "Activo"}</td>
					<td>{user_item.estado_civil}</td>
					<td>{user_item.genero}</td>
					<td>{user_item.hijos ? "No" : "Si"}</td>
					<td> 						
						<div className="col justify-content-end">						
							<div className="row">		
								<div className="col">
									<div className="d-grid gap-3">
										<button 
											type="button" 
											className="btn btn-sm btn-danger ml-2 mr-2" 							
											onClick={(e) => deleteUser(user_item.usuario)}> 
												< BiBox />
										</button>
									</div>
								</div>
								<div className="col">	
									<div className="d-grid gap-3">
										<button 
											type="button" 
											className= "btn btn-sm btn-warning ml-2 mr-2"				
											onClick={(e) => activateUser(user_item)}> 
												< BiLike />
										</button>
									</div>
								</div>	
								<div className="col">	
									<div className="d-grid gap-3">
										< UpdateUserModal selecteduser={user_item}/>
									</div>
								</div>	
								<div className="col">	
									<div className="d-grid gap-3">
										< ResetUserPasswordModal selecteduser={user_item}/>	
									</div>
								</div>	
								
							</div>						
						</div>						
					</td>
				</tr>					
			));
		}

	return (
		<div className>            	
            <Table className="table table-striped table-bordered" responsive>
				<thead className="table-dark">
					<tr>
						<th scope="col">#</th>	
						<th scope="col">Usuario</th>			
						<th scope="col">Nombre</th>		
						<th scope="col">P-Appellido</th>			
						<th scope="col">S-Appellido</th>						
						<th scope="col">CI</th>		
						<th scope="col">Correo</th>	
						<th scope="col">Role</th>
						<th scope="col">Activo</th>
						<th scope="col">Estado cívil</th>
						<th scope="col">Género</th>
						<th scope="col">Hijos</th>
						<th scope="col">Acciones</th>						
					</tr>
				</thead>
				<tbody className="table-group-divider">						
					{renderTableData()}
				</tbody>
			</Table>  
        </div>
	);  
}

export default UserTable;