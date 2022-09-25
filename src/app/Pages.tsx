import React from 'react'

import { Navigate, Route, Routes } from 'react-router-dom'

import { Packs } from '../features/packs/packs/Packs'

import { useAppSelector } from 'app/hooks'
import { PageNotFound } from 'common/404/PageNotFound'
import { ChangePassword } from 'features/auth/change-password/ChangePassword'
import { Login } from 'features/auth/login/Login'
import { PasswordRecovery } from 'features/auth/password-recovery/PasswordRecovery'
import { Profile } from 'features/auth/profile/Profile'
import { Registration } from 'features/auth/registration/Registration'

export const PATH = {
  LOGIN: '/login',
  REGISTRATION: '/registration',
  PASSWORD_RECOVERY: '/password-recovery',
  CHANGE_PASSWORD: '/set-new-password/:token',
  PROFILE: '/profile',
  PACKS: '/packs',
}

export const Pages = () => {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

  return (
    <div>
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path={'/'} element={<Navigate to={PATH.PROFILE} />} />
            <Route path={PATH.LOGIN} element={<Navigate to={PATH.PROFILE} />} />
            <Route path={PATH.PROFILE} element={<Profile />} />
            <Route path={PATH.PACKS} element={<Packs />} />
          </>
        ) : (
          <>
            <Route path={'/'} element={<Navigate to={PATH.LOGIN} />} />
            <Route path={PATH.PROFILE} element={<Navigate to={PATH.LOGIN} />} />
            <Route path={PATH.LOGIN} element={<Login />} />
          </>
        )}
        <Route path={PATH.REGISTRATION} element={<Registration />} />
        <Route path={PATH.PASSWORD_RECOVERY} element={<PasswordRecovery />} />
        <Route path={PATH.CHANGE_PASSWORD} element={<ChangePassword />} />
        <Route path={'/404'} element={<PageNotFound />} />
        <Route path={'*'} element={<Navigate to={'/404'} />} />
      </Routes>
    </div>
  )
}
