import React from 'react'

import { NavLink } from 'react-router-dom'

import { useAppSelector } from 'app/hooks'
import logo from 'assets/images/logo.png'
import s from 'common/header/Header.module.css'

export const Header = () => {
  const isVerifyLogin = useAppSelector(state => state.auth.isVerifyLogin)

  return (
    <div className={s.header}>
      <div className={'container'}>
        <img src={logo} alt={''} />
        {isVerifyLogin && <NavLink to={'profile'}>Profile</NavLink>}
        {!isVerifyLogin && <NavLink to={'login'}>Sign in</NavLink>}
      </div>
    </div>
  )
}
