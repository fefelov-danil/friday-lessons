import React from 'react'

import { useFormik } from 'formik'
import { Navigate, NavLink } from 'react-router-dom'

import s from './Registration.module.css'

import { useAppDispatch, useAppSelector } from 'app/hooks'
import { PATH } from 'app/Pages'
import { Button } from 'common/button/Button'
import { InputPassword } from 'common/inputPassword/InputPassword'
import { InputText } from 'common/inputText/InputText'
import { authIsRegisteredAC, registrationTC } from 'features/auth/auth-reducer'

type FormikErrorType = {
  email?: string
  password?: string
  confirmPassword?: string
}

export const Registration = () => {
  const dispatch = useAppDispatch()
  const isRegistered = useAppSelector(state => state.auth.isRegistered)
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: values => {
      const errors: FormikErrorType = {}

      if (!values.email) {
        errors.email = 'required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
      }

      if (values.confirmPassword !== values.password) {
        errors.confirmPassword = 'Пароли должны совпадать'
      }

      if (!values.password) {
        errors.password = 'required'
      } else if (values.password.length < 8) {
        errors.password = 'Password not valid! must be more than 7 characters'
      }

      return errors
    },
    onSubmit: values => {
      dispatch(registrationTC({ email: values.email, password: values.password }))
    },
  })

  if (isRegistered) {
    dispatch(authIsRegisteredAC(false))

    return <Navigate to={PATH.LOGIN} />
  }

  if (isLoggedIn) {
    return <Navigate to={PATH.PROFILE} />
  }

  return (
    <div className={'formPage'}>
      <div className={'formContainer'}>
        <h1>Sign up</h1>
        <form onSubmit={formik.handleSubmit}>
          <p className={s.fieldName}>Email:</p>
          <label className={s.labelField}>
            <InputText {...formik.getFieldProps('email')} />
            {formik.touched.email && formik.errors.email && (
              <p className={'fieldError'}>{formik.errors.email}</p>
            )}
          </label>
          <p className={s.fieldName}>Password:</p>
          <label className={s.labelField}>
            <InputPassword {...formik.getFieldProps('password')} />
            {formik.touched.password && formik.errors.password && (
              <p className={'fieldError'}>{formik.errors.password}</p>
            )}
          </label>
          <p className={s.fieldName}>Confirm password:</p>
          <label className={s.labelField}>
            <InputPassword {...formik.getFieldProps('confirmPassword')} />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className={'fieldError'}>{formik.errors.confirmPassword}</p>
            )}
          </label>
          <Button type={'submit'} className={s.signInBtn}>
            Sign Up
          </Button>
        </form>
        <p className={s.loginText}>Already have account?</p>
        <p className={s.loginLink}>
          <NavLink to={PATH.LOGIN}>Sign in</NavLink>
        </p>
      </div>
    </div>
  )
}
