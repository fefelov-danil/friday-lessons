import React from 'react'

import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import { NavLink } from 'react-router-dom'

import s from './LinkToPacks.module.css'

export const LinkToPacks = () => {
  return (
    <NavLink className={s.linkToPacks} to={'/packs'}>
      <KeyboardDoubleArrowLeftIcon />
      back to packs
    </NavLink>
  )
}
