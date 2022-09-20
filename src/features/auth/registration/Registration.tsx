import { RootState } from 'app/store'
import { Button } from 'common/button/Button'
import { InputText } from 'common/input/InputText'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Navigate, NavLink } from 'react-router-dom'
import { signUpTC } from './registration-reducer'

export const Registration = () => {

  const dispatch = useDispatch<any>()

  const errMessage = useSelector<RootState, string>(state => state.registration.errorMessage)

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [mess, setMess] = useState<string>('');

  const confirmRegistrationHandler = () => {
    if (password === repeatPassword) {
      dispatch(signUpTC(email, password))
      setEmail('')
      setPassword('')
      setRepeatPassword('')
    } else {
      setMess('confirm your password currectly')
    }
  }

  // if ('logged in') return <Navigate to={'/main page'}/>

  return (
    <div>
      <h1>Registration</h1>

      <InputText
        placeholder='email'
        value={email}
        onChange={(e) => { setEmail(e.currentTarget.value) }}
      />
      <InputText
        placeholder='password'
        value={password}
        onChange={(e) => { setPassword(e.currentTarget.value) }}
      />
      <InputText
        placeholder='repeatPassword'
        value={repeatPassword}
        onChange={(e) => { setRepeatPassword(e.currentTarget.value) }}
      />
      <Button onClick={confirmRegistrationHandler}>OK</Button>
      {errMessage && <div>{errMessage}</div>}
      {mess && <div>{mess}</div>}

      <p>Already have an account?</p>
      <NavLink to={'/login'}>Sign In</NavLink>

    </div>
  )
}
