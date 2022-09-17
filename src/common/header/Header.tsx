import React from 'react'

import { NavLink } from 'react-router-dom'

import s from 'common/header/Header.module.css'

export const Header = () => {
  return (
    <div className={s.header}>
      <NavLink to={'login'}>Login</NavLink>
      <NavLink to={'registration'}>Registration</NavLink>
      <NavLink to={'password-recovery'}>Password recovery</NavLink>
      <NavLink to={'change-password'}>Change password</NavLink>
      <NavLink to={'profile'}>Profile</NavLink>
    </div>
  )
}
