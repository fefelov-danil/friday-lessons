import React, { ChangeEvent, useState } from 'react'

import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { Avatar, Badge, IconButton, Box } from '@mui/material'
import { NavLink } from 'react-router-dom'

import { logoutTC, updateUserTC } from '../auth-reducer'

import s from './Profile.module.css'

import { appAlertAC } from 'app/app-reducer'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { BackArrowButton } from 'common/BackArrowButton/BackArrowButton'
import { Button } from 'common/button/Button'
import { InputText } from 'common/inputText/InputText'
import { convertFileToBase64 } from 'utils/convertFileToBase64'
import { handleServerError } from 'utils/error-utils'

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
      dispatch(updateUserTC({ name: newName.trim() }))
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
  const uploadHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files && e.target.files[0]

      if (file.size < 400000) {
        convertFileToBase64(file, (file64: string) => {
          dispatch(updateUserTC({ avatar: file64 }))
        })
      } else {
        dispatch(appAlertAC('Incorrect file size or type', 'error'))
      }
    }
  }
  const errorHandler = (): void => {
    dispatch(updateUserTC({ avatar: ' ' }))
    dispatch(appAlertAC('Broken image', 'error'))
  }

  return (
    <div className="formPage">
      <div className={s.arrowButton}>
        <BackArrowButton />
      </div>
      <div className={'formContainer ' + s.profileContainer}>
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          badgeContent={
            <label htmlFor="icon-button-photo">
              <input
                style={{ display: 'none' }}
                type="file"
                accept="image/*"
                onChange={uploadHandler}
                id="icon-button-photo"
              />
              <IconButton component="span" style={{ backgroundColor: '#808080' }}>
                <PhotoCameraIcon style={{ color: 'white' }} sx={{ cursor: 'pointer' }} />
              </IconButton>
            </label>
          }
        >
          <Avatar
            alt="avatar"
            src={profileData.user?.avatar}
            sx={{ width: 140, height: 140 }}
            onError={errorHandler}
          />
        </Badge>
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
