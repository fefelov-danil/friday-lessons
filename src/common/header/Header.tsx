import React from 'react'

import { NavLink } from 'react-router-dom'

import { useAppSelector } from 'app/hooks'
import logo from 'assets/images/logo.png'
import s from 'common/header/Header.module.css'

export const Header = () => {
  const isVerifyLogin = useAppSelector(state => state.auth.isVerifyLogin)
  const userData = useAppSelector(state => state.auth.user)

  let avatar
  let username = userData?.name

  if (userData?.avatar) {
    avatar = userData.avatar
  } else {
    avatar =
      'https://www.gravatar.com/avatar/ca6f903ac1e11977898f9b0c9b3d5292.jpg?size=240&d=https%3A%2F%2Fwww.artstation.com%2Fassets%2Fdefault_avatar.jpg'
  }

  return (
    <div className={s.header}>
      <div className={'container'}>
        <NavLink to={'/'}>
          <img src={logo} alt={''} />
        </NavLink>
        {isVerifyLogin ? (
          <>
            <NavLink className={s.profileLink} to={'/profile'}>
              <img className={s.headerAvatar} src={avatar} alt="avatar" />
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
