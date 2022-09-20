import React, { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes, KeyboardEvent } from 'react'

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
  const onChangeCallback = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e)
    onChangePassword && onChangePassword(e.currentTarget.value)
  }
  const onKeyPressCallback = (e: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown && onKeyDown(e)
    onEnter && e.key === 'Enter' && onEnter()
  }

  const finalSpanClassName = `${s.error} ${spanClassName ? spanClassName : ''}`
  const finalInputClassName = `${s.inputPassword} ${error && s.errorInput} ${className}` // need to fix with (?:) and s.superInput

  return (
    <>
      <input
        type={'password'}
        onChange={onChangeCallback}
        onKeyDown={onKeyPressCallback}
        className={finalInputClassName}
        {...restProps}
      />
      <br />
      {error && <span className={finalSpanClassName}>{error}</span>}
    </>
  )
}