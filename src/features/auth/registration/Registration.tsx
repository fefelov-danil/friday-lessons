import React, { useState } from 'react'

import { useFormik } from 'formik'
import { useSelector, useDispatch } from 'react-redux'
import { Navigate, NavLink } from 'react-router-dom'

import { signUpTC } from '../auth-reducer'

import s from './Registration.module.css'

import { RootState } from 'app/store'
import { Button } from 'common/button/Button'
import { InputText } from 'common/inputText/InputText'

type FormikErrorType = {
  email?: string
  password?: string
  repeatPassword?: string
}

export const Registration = () => {
  const dispatch = useDispatch<any>()

  const errMessage = useSelector<RootState, string>(state => state.auth.errorMessage)
  const isRegistered = useSelector<RootState, boolean>(state => state.auth.isRegistered)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      repeatPassword: '',
    },
    validate: values => {
      const errors: FormikErrorType = {}

      if (!values.email) {
        errors.email = 'email is required'
      } else if (!/^[A-Z/d._%+-]+@[A-Z/d.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
      } else if (!values.password) {
        errors.password = 'password is required'
      } else if (!values.repeatPassword) {
        errors.repeatPassword = 'password is required'
      } else if (values.password.length < 8) {
        errors.password = 'min length 8 symbols'
      } else if (values.repeatPassword.length < 8) {
        errors.repeatPassword = 'min length 8 symbols'
      } else if (values.repeatPassword !== values.password) {
        errors.repeatPassword = 'confirm your password currectly'
      }

      return errors
    },
    onSubmit: values => {
      dispatch(signUpTC(values.email, values.password))
      formik.resetForm()
    },
  })

  // if ('logged in') return <Navigate to={'/main page'}/>
  // if (isRegistered) return <Navigate to={'/login'} />

  return (
    <div className={'formPage'}>
      <div className={'formContainer'}>
        <h1>Registration</h1>
        <form onSubmit={formik.handleSubmit}>
          <p className={s.fieldName}>Email:</p>
          <label className={s.labelField}>
            <InputText {...formik.getFieldProps('email')} placeholder={'email'} />
            {formik.touched.email && formik.errors.email && (
              <p className={'fieldError'}>{formik.errors.email}</p>
            )}
          </label>

          <p className={s.fieldName}>Password:</p>
          <label className={s.labelField}>
            <InputText
              {...formik.getFieldProps('password')}
              placeholder={'password'}
              type={'password'}
            />
            {formik.touched.password && formik.errors.password && (
              <p className={'fieldError'}>{formik.errors.password}</p>
            )}
          </label>

          <p className={s.fieldName}>Repeat password:</p>
          <label className={s.labelField}>
            <InputText
              {...formik.getFieldProps('repeatPassword')}
              placeholder={'confirm password'}
              type={'password'}
            />
            {formik.touched.repeatPassword && formik.errors.repeatPassword && (
              <p className={'fieldError'}>{formik.errors.repeatPassword}</p>
            )}
          </label>

          {errMessage && <div className={s.helperText}>{errMessage}</div>}

          <Button
            disabled={Object.keys(formik.errors).length !== 0}
            type={'submit'}
            className={s.signUpBtn}
          >
            Sign Up
          </Button>
        </form>

        <p className={s.helperText}>Already have an account?</p>
        <p className={s.helperNavLink}>
          <NavLink to={'/login'}>Sign In</NavLink>
        </p>
      </div>
    </div>
  )
}
