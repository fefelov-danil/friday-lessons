import React, { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes } from 'react'

import s from 'common/checkbox/Checkbox.module.css'

// Пропсы стандартного инпута
type DefaultInputPropsType = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

type CheckboxPropsType = DefaultInputPropsType & {
  onChangeChecked?: (checked: boolean) => void
  spanClassName?: string
}

export const Checkbox: React.FC<CheckboxPropsType> = ({
  type,
  onChange,
  onChangeChecked,
  className,
  spanClassName,
  children,
  ...restProps
}) => {
  const onChangeCallback = (e: ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e)
    onChangeChecked && onChangeChecked(e.currentTarget.checked)
  }

  const finalInputClassName = `${s.checkbox} ${className ? className : ''}`

  return (
    <label className={s.labelCheckbox}>
      <input
        type={'checkbox'}
        onChange={onChangeCallback}
        className={finalInputClassName}
        {...restProps}
      />
      <span className={s.listItem}></span>
      {children && <span className={s.textForCheckbox}>{children}</span>}
    </label>
  )
}
