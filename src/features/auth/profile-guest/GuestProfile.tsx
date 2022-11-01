import { useState, useEffect } from 'react'

import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import { Avatar, Badge, IconButton } from '@mui/material'
import { useParams } from 'react-router-dom'

import { getGuestUserProfileTC, logoutTC, updateUserTC } from '../auth-reducer'

import s from './GuestProfile.module.css'

import { appAlertAC } from 'app/app-reducer'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { BackArrowButton } from 'common/BackArrowButton/BackArrowButton'
import { Button } from 'common/button/Button'
import { InputText } from 'common/inputText/InputText'
import { UploadImage } from 'common/UploadImage/UploadImage'
import { parseDate } from 'utils/parse-date-util'

export const GuestProfile = () => {
  const guestUser = useAppSelector(state => state.auth.guestUser)
  const dispatch = useAppDispatch()
  const { userId } = useParams()

  useEffect(() => {
    userId && dispatch(getGuestUserProfileTC(userId))
  }, [])

  return (
    <div className="formPage">
      <div className={s.arrowButton}>
        <BackArrowButton />
      </div>
      <div className={'formContainer ' + s.profileContainer}>
        <Avatar alt="avatar" src={guestUser?.avatar} sx={{ width: 140, height: 140 }} />

        <>
          <p className={s.username}>{guestUser?.name}</p>
          <p className={s.username}>email: {guestUser?.email}</p>
          <p className={s.username}>public repo: {guestUser?.publicCardPacksCount}</p>
          <p className={s.username}>created: {parseDate(guestUser?.created, true)}</p>
        </>

        <Button className={s.profileButton}>Logout</Button>
      </div>
    </div>
  )
}
