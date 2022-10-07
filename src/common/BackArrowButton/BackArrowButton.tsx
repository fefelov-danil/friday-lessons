import React from 'react'

import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import Typography from '@mui/material/Typography/Typography'
import { useNavigate } from 'react-router-dom'

import s from './BackArrowButton.module.css'

type BackButtonPropsType = {
  title?: string
  packData?: {
    packId: string | undefined
    packName: string | undefined
  }
}

export const BackArrowButton = ({ title, packData }: BackButtonPropsType) => {
  let textForButton = title ? title : 'Packs List'
  let paramsForButton = packData ? `/packs/${packData.packId}/${packData.packName}` : '/packs'

  const navigate = useNavigate()

  const goBack = () => {
    navigate(paramsForButton)
  }

  return (
    <div onClick={goBack} className={s.link}>
      <KeyboardDoubleArrowLeftIcon style={{ color: 'white' }} />
      <Typography className={s.title}>Back to {textForButton}</Typography>
    </div>
  )
}
