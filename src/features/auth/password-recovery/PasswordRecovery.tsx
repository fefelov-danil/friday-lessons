import React from 'react'

import DraftsIcon from '@mui/icons-material/Drafts'
import { useFormik } from 'formik'
import { NavLink } from 'react-router-dom'

import s from './PasswordRecovery.module.css'

import { useAppDispatch, useAppSelector } from 'app/hooks'
import { Button } from 'common/button/Button'
import { InputText } from 'common/inputText/InputText'
import { setCheckEmailRedirect, forgotPasswordThunk } from 'features/auth/auth-reducer'

type FormikErrorType = {
  email?: string
}

export const PasswordRecovery = () => {
  const dispatch = useAppDispatch()
  const checkEmailRedirect = useAppSelector(state => state.auth.checkEmailRedirect)

  const formik = useFormik({
    initialValues: {
      email: '',
      from: 'test-front-admin <roman.petrakovskiy@gmail.com>',
      message: `<p>password recovery link: 
      <a href='http://localhost:3000//friday-lessons/#/set-new-password/$token$'>link</a></p>`,
    },
    validate: values => {
      const errors: FormikErrorType = {}

      if (!values.email) {
        errors.email = 'required'
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
      }

      return errors
    },
    onSubmit: values => {
      dispatch(forgotPasswordThunk(values))
      formik.resetForm()
    },
  })

  return (
    <div className={'formPage'}>
      {checkEmailRedirect ? (
        <div className={'formContainer'}>
          <h1>Check Email</h1>
          <p className={s.iconForm}>
            <DraftsIcon sx={{ color: '#F85156' }} />
          </p>
          <p className={s.desc}>
            We&apos;we sent an Email with instructions to the address provided.
          </p>
          <p className={s.loginLink}>
            <NavLink
              to={'/login'}
              className={'standardBtn'}
              onClick={() => dispatch(setCheckEmailRedirect(false))}
            >
              Sign in
            </NavLink>
          </p>
        </div>
      ) : (
        <div className={'formContainer'}>
          <h1 className={s.title}>Password recovery</h1>
          <form onSubmit={formik.handleSubmit}>
            <p className={s.fieldName}>Email:</p>
            <label className={s.labelField}>
              <InputText {...formik.getFieldProps('email')} />
              {formik.touched.email && formik.errors.email && (
                <p className={'fieldError'}>{formik.errors.email}</p>
              )}
            </label>
            <p className={s.desc}>
              Enter your email address and we will send you further instructions
            </p>
            <Button type={'submit'} className={s.signInBtn}>
              Send Instructions
            </Button>
          </form>
          <p className={s.registrationText}>Did you remember your password?</p>
          <p className={s.registrationLink}>
            <NavLink to={'/login'}>Try logging in</NavLink>
          </p>
        </div>
      )}
    </div>
  )
}
