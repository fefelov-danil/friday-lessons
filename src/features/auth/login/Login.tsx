import React from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { AppDispatch, RootState } from '../../../app/store'
import { AuthStateType, loginTC } from '../auth-reducer'

export const Login = () => {
  const dispatch = useDispatch<AppDispatch>()
  const data = useSelector<RootState, AuthStateType>(state => state.auth)

  if (data.isLoggedIn) {
    return <Navigate to={'/profile'} />
  }

  const login = () => {
    dispatch(loginTC())
  }

  return (
    <div>
      <h1>Login</h1>
      <button onClick={login}>login</button>
    </div>
  )
}
