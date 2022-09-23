import React, {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  KeyboardEvent,
  useState,
} from 'react'

import DraftsIcon from '@mui/icons-material/Drafts'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'

import s from './InputPassword.module.css'

// Пропсы стандартного инпута
type DefaultInputPasswordPropsType = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

type InputPasswordPropsType = DefaultInputPasswordPropsType & {
  onChangePassword?: (value: string) => void
  onEnter?: () => void
  error?: string
  spanClassName?: string
}

export const InputPassword: React.FC<InputPasswordPropsType> = ({
  type,
  onChange,
  onChangePassword,
  onKeyDown,
  onEnter,
  error,
  className,
  spanClassName,
  ...restProps
}) => {
  const [showPass, setShowPass] = useState(false)

  const onChangeCallback = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e)
    onChangePassword && onChangePassword(e.currentTarget.value)
  }
  const onKeyPressCallback = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown && onKeyDown(e)
    onEnter && e.key === 'Enter' && onEnter()
  }

  const finalSpanClassName = `${s.error} ${spanClassName ? spanClassName : ''}`
  const finalInputClassName = `${s.inputPassword} ${error && s.errorInput} ${className}`

  return (
    <p className={s.inputContainer}>
      <input
        type={showPass ? 'text' : 'password'}
        onChange={onChangeCallback}
        onKeyDown={onKeyPressCallback}
        className={finalInputClassName}
        {...restProps}
      />
      <span onClick={() => setShowPass(!showPass)}>
        {showPass ? (
          <DraftsIcon sx={{ color: '#333333' }} />
        ) : (
          <RemoveRedEyeIcon sx={{ color: '#333333' }} />
        )}
      </span>

      <br />
      {error && <span className={finalSpanClassName}>{error}</span>}
    </p>
  )
}
