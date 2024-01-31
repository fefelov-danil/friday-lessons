import { useState } from 'react'

import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { Avatar, Badge, IconButton } from '@mui/material'

import { logoutThunk, updateUserThunk } from '../auth-reducer'

import s from './Profile.module.css'

import { appAlertAC } from 'app/app-reducer'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { BackArrowButton } from 'common/BackArrowButton/BackArrowButton'
import { Button } from 'common/button/Button'
import { InputText } from 'common/inputText/InputText'
import { UploadImage } from 'common/UploadImage/UploadImage'

export const Profile = () => {
  const profileData = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()
  const [isNameChanging, setIsNameChanging] = useState(false)
  const [newName, setNewName] = useState('')

  const logoutHandler = () => {
    dispatch(logoutThunk())
  }

  const onSaveNameHandler = () => {
    if (newName.trim().length === 0) {
      dispatch(appAlertAC({ message: 'Name is required!', type: 'error' }))
    } else {
      dispatch(updateUserThunk({ name: newName.trim() }))
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
  const changeAvatar = (file64: string): void => {
    dispatch(updateUserThunk({ avatar: file64 }))
  }
  const errorHandler = (): void => {
    dispatch(updateUserThunk({ avatar: ' ' }))
    dispatch(appAlertAC({ message: 'Broken image', type: 'error' }))
  }

  return (
    <div className="formPage">
      <div className={s.arrowButton}>
        <BackArrowButton />
      </div>
      <div className={'formContainer ' + s.profileContainer}>
        <UploadImage callBackFn={changeAvatar}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <IconButton component="span" style={{ backgroundColor: '#808080' }}>
                <PhotoCameraIcon style={{ color: 'white' }} sx={{ cursor: 'pointer' }} />
              </IconButton>
            }
          >
            <Avatar
              alt="avatar"
              src={profileData.user?.avatar}
              sx={{ width: 140, height: 140 }}
              onError={errorHandler}
            />
          </Badge>
        </UploadImage>
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
{
  /* <Badge
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
        </Badge> */
}
