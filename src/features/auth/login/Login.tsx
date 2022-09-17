import React from 'react'

import { NavLink } from 'react-router-dom'

import s from './Login.module.css'

import { Button } from 'common/button/Button'
import { Checkbox } from 'common/checkbox/Checkbox'
import { InputText } from 'common/input/InputText'

export const Login = () => {
  return (
    <div className={s.loginPage}>
      <div className={s.loginContainer}>
        <h1>Sign in</h1>
        <p className={s.fieldName}>Email:</p>
        <InputText />
        <p className={s.fieldName}>Password:</p>
        <InputText />
        <Checkbox>Remember me</Checkbox>
        <p className={s.forgotPassword}>
          <NavLink to={'password-recovery'}>Forgot Password?</NavLink>
        </p>
        <Button className={s.signInBtn}>Sign In</Button>
      </div>
    </div>
  )
}
