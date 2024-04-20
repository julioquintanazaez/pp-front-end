import React, { useState, useEffect, useContext } from 'react';
import { Context } from './../context/Context';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';
import { Navigate, useLocation, Outlet } from 'react-router-dom';


export const ProtectedRoute = ({ isAllowed,
								redirectPath = '/',
								children
								}) => {
	
	const location = useLocation();	
	
	if (!isAllowed) {
		return (
			<Navigate to={ redirectPath } replace state={{ from: location }} />
		);
	}
	
	return children ? children : <Outlet />;
};
