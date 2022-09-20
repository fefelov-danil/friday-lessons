import React from 'react'

import { useFormik } from 'formik'
import { useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'

import s from './Login.module.css'

import { useAppDispatch } from 'app/hooks'
import { Button } from 'common/button/Button'
import { Checkbox } from 'common/checkbox/Checkbox'
import { InputPassword } from 'common/inputPassword/InputPassword'
import { InputText } from 'common/inputText/InputText'
import { loginTC } from 'features/auth/auth-reducer'

type FormikErrorType = {
  email?: string
  password?: string
  rememberMe?: boolean
}

export const Login = () => {
  const dispatch = useAppDispatch()

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validate: values => {
      const errors: FormikErrorType = {}

      if (!values.email) {
        errors.email = 'required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
      }

      if (!values.password) {
        errors.password = 'required'
      } else if (values.password.length < 3) {
        errors.password = 'Пароль должен быть длиннее 2х символов'
      }

      return errors
    },
    onSubmit: values => {
      dispatch(loginTC(values))
      formik.resetForm()
    },
  })

  return (
    <div className={s.loginPage}>
      <div className={s.loginContainer}>
        <h1>Sign in</h1>
        <form onSubmit={formik.handleSubmit}>
          <p className={s.fieldName}>Email:</p>
          <label className={s.labelField}>
            <InputText {...formik.getFieldProps('email')} />
            {formik.touched.email && formik.errors.email && (
              <p className={s.fieldError}>{formik.errors.email}</p>
            )}
          </label>
          <p className={s.fieldName}>Password:</p>
          <label className={s.labelField}>
            <InputPassword {...formik.getFieldProps('password')} />
            {formik.touched.password && formik.errors.password && (
              <p style={{ color: 'red' }}>{formik.errors.password}</p>
            )}
          </label>
          <label className={s.labelCheckbox}>
            <Checkbox {...formik.getFieldProps('rememberMe')}>Remember me</Checkbox>
          </label>
          <p className={s.forgotPassword}>
            <NavLink to={'/password-recovery'}>Forgot Password?</NavLink>
          </p>
          <Button type={'submit'} className={s.signInBtn}>
            Sign In
          </Button>
        </form>
        <p className={s.registrationText}>Create a new account</p>
        <p className={s.registrationLink}>
          <NavLink to={'/registration'}>Sign up</NavLink>
        </p>
      </div>
    </div>
  )
}
