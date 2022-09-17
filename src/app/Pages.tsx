import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "features/auth/login/Login";
import {Registration} from "features/auth/registration/Registration";
import {PasswordRecovery} from "features/auth/password-recovery/PasswordRecovery";
import {ChangePassword} from "features/auth/change-password/ChangePassword";
import {Profile} from "features/auth/profile/Profile";
import {PageNotFound} from "common/404/PageNotFound";

export const PATH = {
    LOGIN: '/login',
    REGISTRATION: '/registration',
    PASSWORD_RECOVERY: '/password-recovery',
    CHANGE_PASSWORD: '/change-password',
    PROFILE: '/profile'
}

export const Pages = () => {
    return (
        <div>
            <Routes>
                <Route path={'/'} element={<Navigate to={PATH.LOGIN}/>}/>
                <Route path={PATH.LOGIN} element={<Login/>}/>
                <Route path={PATH.REGISTRATION} element={<Registration/>}/>
                <Route path={PATH.PASSWORD_RECOVERY} element={<PasswordRecovery/>}/>
                <Route path={PATH.CHANGE_PASSWORD} element={<ChangePassword/>}/>
                <Route path={PATH.PROFILE} element={<Profile/>}/>
                <Route path={'/404'} element={<PageNotFound/>}/>
                <Route path={'*'} element={<Navigate to={'/404'}/>}/>
            </Routes>
        </div>
    );
};