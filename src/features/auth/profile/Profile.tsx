import React, { useState } from 'react'

import { changeUsernameTC, logoutTC } from '../auth-reducer'

import s from './Profile.module.css'

import { appAlertAC } from 'app/app-reducer'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { Button } from 'common/button/Button'
import { InputText } from 'common/inputText/InputText'

export const Profile = () => {
  const profileData = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const [isNameChanging, setIsNameChanging] = useState(false)
  const [newName, setNewName] = useState('')

  const logoutHandler = () => {
    dispatch(logoutTC())
  }

  const onSaveNameHandler = () => {
    if (newName.trim().length === 0) {
      dispatch(appAlertAC('Name is required!', 'error'))
    } else {
      dispatch(changeUsernameTC(newName))
    }
    setIsNameChanging(false)
  }
  const onKeyDownHandler = (key: string) => {
    if (key === 'Escape') {
      setIsNameChanging(false)
    } else if (key === 'Enter') {
      onSaveNameHandler()
    }
  }
  const onNameChange = (name: string) => {
    setNewName(name)
  }
  const onChangeNameHandler = () => {
    profileData.user && setNewName(profileData.user.name)
    setIsNameChanging(true)
  }

  // if (!profileData.authIsLoggedIn) {
  //   dispatch(setAppLoadingAC(true))
  // }

  return (
    <div className="formPage">
      <div className={'formContainer ' + s.profileContainer}>
        <img
          style={{ width: '100px', height: '100px', borderRadius: '50%', display: 'inline-block' }}
          src={
            profileData.user?.avatar
              ? profileData.user.avatar
              : 'https://www.gravatar.com/avatar/ca6f903ac1e11977898f9b0c9b3d5292.jpg?size=240&d=https%3A%2F%2Fwww.artstation.com%2Fassets%2Fdefault_avatar.jpg'
          }
          alt="avatar"
        />
        {isNameChanging ? (
          <>
            <InputText
              value={newName}
              onChange={e => onNameChange(e.currentTarget.value)}
              autoFocus={true}
              onKeyDown={e => onKeyDownHandler(e.key)}
            />
            <Button className={s.profileButton} onClick={onSaveNameHandler}>
              Save
            </Button>
          </>
        ) : (
          <>
            <p className={s.username}>{profileData.user?.name}</p>
            <Button className={s.profileButton} onClick={onChangeNameHandler}>
              Change name
            </Button>
          </>
        )}
        <Button className={s.profileButton} onClick={logoutHandler}>
          Logout
        </Button>
      </div>
    </div>
  )
}
