import React from 'react'

import { NavLink } from 'react-router-dom'

import { useAppSelector } from 'app/hooks'
import logo from 'assets/images/logo.png'
import s from 'common/header/Header.module.css'

export const Header = () => {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
  const userData = useAppSelector(state => state.auth.user)

  return (
    <div className={s.header}>
      <div className={'container'}>
        <NavLink to={'/'}>
          <img src={logo} alt={''} />
        </NavLink>
        {isLoggedIn ? (
          <>
            <NavLink className={s.profileLink} to={'/profile'}>
              <img className={s.headerAvatar} src={userData?.avatar} alt="avatar" />
              {userData?.name}
            </NavLink>
          </>
        ) : (
          <NavLink to={'/login'}>Sign in</NavLink>
        )}
      </div>
    </div>
  )
}
