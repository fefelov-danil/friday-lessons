import React from 'react'

import { useFormik } from 'formik'
import { useParams } from 'react-router-dom'

import s from './ChangePassword.module.css'

import { useAppDispatch } from 'app/hooks'
import { Button } from 'common/button/Button'
import { InputPassword } from 'common/inputPassword/InputPassword'
import { changePasswordTC } from 'features/auth/auth-reducer'

type FormikErrorType = {
  password?: string
}

export const ChangePassword = () => {
  const dispatch = useAppDispatch()
  const { token } = useParams()

  const formik = useFormik({
    initialValues: {
      password: '',
      resetPasswordToken: token as string,
    },
    validate: values => {
      const errors: FormikErrorType = {}

      if (!values.password) {
        errors.password = 'required'
      } else if (values.password.length < 3) {
        errors.password = 'Пароль должен быть длиннее 2х символов'
      }

      return errors
    },
    onSubmit: values => {
      dispatch(changePasswordTC(values))
      formik.resetForm()
    },
  })

  return (
    <div className={'formPage'}>
      <div className={'formContainer'}>
        <h1 className={s.title}>Create new password</h1>
        <form onSubmit={formik.handleSubmit}>
          <p className={s.fieldName}>Password:</p>
          <label className={s.labelField}>
            <InputPassword {...formik.getFieldProps('password')} />
            {formik.touched.password && formik.errors.password && (
              <p className={'fieldError'}>{formik.errors.password}</p>
            )}
          </label>
          <p className={s.desc}>
            Create new password and we will send you further instructions to email
          </p>
          <Button type={'submit'} className={s.passwordBtn}>
            Create new password
          </Button>
        </form>
      </div>
    </div>
  )
}
