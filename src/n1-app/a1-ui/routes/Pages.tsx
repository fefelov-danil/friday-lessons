import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "n2-features/f1-auth/a1-login/Login";
import {Registration} from "n2-features/f1-auth/a2-registration/Registration";
import {PasswordRecovery} from "n2-features/f1-auth/a3-password-recovery/PasswordRecovery";
import {ChangePassword} from "n2-features/f1-auth/a4-change-password/ChangePassword";
import {Profile} from "n2-features/f1-auth/a5-profile/Profile";
import {PageNotFound} from "n1-app/a1-ui/common/404/PageNotFound";
import {Test} from "n1-app/a1-ui/Test";

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
                <Route path={'test'} element={<Test/>}/>
            </Routes>
        </div>
    );
};