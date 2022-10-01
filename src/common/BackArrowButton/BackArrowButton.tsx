import React from 'react'

import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import Typography from '@mui/material/Typography/Typography'
import { NavLink } from 'react-router-dom'

import s from './BackArrowButton.module.css'

import { PATH } from 'app/Pages'

export const BackArrowButton = () => {
  return (
    <NavLink to={PATH.PACKS} className={s.link}>
      <KeyboardDoubleArrowLeftIcon style={{ color: 'white' }} />
      <Typography className={s.title}>&nbsp;Back to Packs List</Typography>
    </NavLink>
  )
}
