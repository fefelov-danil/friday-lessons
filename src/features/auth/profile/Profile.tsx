import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { AppDispatch, RootState } from '../../../app/store'
import { Button } from '../../../common/button/Button'
import { InputText } from '../../../common/input/InputText'
import { AuthStateType, changeUsernameTC, initializeAppTC, logoutTC } from '../auth-reducer'

export const Profile = () => {
  const profileData = useSelector<RootState, AuthStateType>(state => state.auth)
  const dispatch = useDispatch<AppDispatch>()
  const [isNameChanging, setIsNameChanging] = useState<boolean>(false)
  const [newName, setNewName] = useState<string>(profileData.user?.name || '')
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    dispatch(initializeAppTC())
  }, [])

  const logoutHandler = () => {
    dispatch(logoutTC())
  }
  const onSaveNameHandler = () => {
    if (newName.trim().length === 0) {
      setNameError('Name is required!')
    } else {
      dispatch(changeUsernameTC(newName))
    }
    setIsNameChanging(false)
  }
  // const onBlurHandler = () => {
  //   setIsNameChanging(false)
  //   setNewName(profileData.user?.name || '')
  // }
  const onKeyDownHandler = (key: string) => {
    if (key === 'Escape') {
      setIsNameChanging(false)
      setNewName(profileData.user?.name || '')
    } else if (key === 'Enter') {
      onSaveNameHandler()
    }
  }
  const onNameChange = (name: string) => {
    setNameError('')
    setNewName(name)
  }

  if (!profileData.isInitialized) {
    return <div>loading..</div>
  }

  if (!profileData.isLoggedIn) {
    return <Navigate to={'/login'} />
  }

  return (
    <div>
      <img
        style={{ width: '100px', height: '100px', borderRadius: '50%', display: 'inline-block' }}
        src={
          profileData.user
            ? profileData.user?.avatar
            : 'https://www.gravatar.com/avatar/ca6f903ac1e11977898f9b0c9b3d5292.jpg?size=240&d=https%3A%2F%2Fwww.artstation.com%2Fassets%2Fdefault_avatar.jpg'
        }
        alt="avatar"
      />
      <div>{nameError}</div>
      {isNameChanging ? (
        <>
          <InputText
            value={newName}
            onChange={e => onNameChange(e.currentTarget.value)}
            // onBlur={onBlurHandler}
            autoFocus={true}
            onKeyDown={e => onKeyDownHandler(e.key)}
          />
          <Button onClick={onSaveNameHandler}>Save</Button>
        </>
      ) : (
        <>
          <div>{profileData.user?.name}</div>
          <Button onClick={() => setIsNameChanging(true)}>Change name</Button>
        </>
      )}
      <Button onClick={logoutHandler}>Logout</Button>
    </div>
  )
}
