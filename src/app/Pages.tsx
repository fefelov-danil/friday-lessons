import React from 'react'

import { Navigate, Route, Routes } from 'react-router-dom'

import { useAppSelector } from 'app/hooks'
import { PageNotFound } from 'common/404/PageNotFound'
import { Login } from 'features/auth/login/Login'
import { Profile } from 'features/auth/profile/Profile'

export const PATH = {
  LOGIN: '/login',
  REGISTRATION: '/registration',
  PASSWORD_RECOVERY: '/password-recovery',
  CHANGE_PASSWORD: '/change-password',
  PROFILE: '/profile',
}

export const Pages = () => {
  const isVerifyLogin = useAppSelector(state => state.auth.isVerifyLogin)

  return (
    <div>
      <Routes>
        {isVerifyLogin ? (
          <>
            <Route path={'/'} element={<Navigate to={PATH.PROFILE} />} />
            <Route path={PATH.LOGIN} element={<Navigate to={PATH.PROFILE} />} />
            <Route path={PATH.PROFILE} element={<Profile />} />
          </>
        ) : (
          <>
            <Route path={'/'} element={<Navigate to={PATH.LOGIN} />} />
            <Route path={PATH.PROFILE} element={<Navigate to={PATH.LOGIN} />} />
            <Route path={PATH.LOGIN} element={<Login />} />
          </>
        )}
        <Route path={'/404'} element={<PageNotFound />} />
        <Route path={'*'} element={<Navigate to={'/404'} />} />
      </Routes>
    </div>
  )
}
