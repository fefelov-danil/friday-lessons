import React, { useEffect } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { AppDispatch, RootState } from '../../../app/store'
import { Button } from '../../../common/button/Button'
import { AuthStateType, initializeAppTC, logoutTC } from '../auth-reducer'

export const Profile = () => {
  const profileData = useSelector<RootState, AuthStateType>(state => state.auth)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(initializeAppTC())
  }, [])

  if (!profileData.isInitialized) {
    return <div>loading..</div>
  }

  if (!profileData.isLoggedIn) {
    return <Navigate to={'/login'} />
  }

  const logout = () => {
    dispatch(logoutTC())
  }

  return (
    <div>
      <Button onClick={logout}>logout</Button>
      <Button>aa</Button>
    </div>
  )
}
