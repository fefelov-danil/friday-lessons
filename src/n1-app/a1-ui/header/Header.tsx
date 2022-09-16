import React from 'react';
import s from 'n1-app/a1-ui/header/Header.module.css'
import {NavLink} from "react-router-dom";

export const Header = () => {
    return (
        <div className={s.header}>
            <NavLink to={'login'}>Login</NavLink>
            <NavLink to={'registration'}>Registration</NavLink>
            <NavLink to={'password-recovery'}>Password recovery</NavLink>
            <NavLink to={'change-password'}>Change password</NavLink>
            <NavLink to={'profile'}>Profile</NavLink>
            <NavLink to={'test'}>Test</NavLink>
        </div>
    );
};