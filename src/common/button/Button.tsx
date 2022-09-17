import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

import s from 'common/button/Button.module.css'

type DefaultButtonPropsType = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

type ButtonPropsType = DefaultButtonPropsType & {
  className?: string
}

export const Button: React.FC<ButtonPropsType> = ({ className, ...restProps }) => {
  const finalClassName = `${s.button} ${className}`

  return <button className={finalClassName} {...restProps} />
}
