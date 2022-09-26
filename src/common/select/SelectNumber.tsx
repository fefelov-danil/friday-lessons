import React from 'react'

import s from './Select.module.css'

type PropsType = {
  value: number
  onChange: (value: number) => void
  options: number[]
  disabled?: boolean
  className?: string
}

export const SelectNumber = (props: PropsType) => {
  return (
    <>
      <select
        className={s.select + ' ' + props.className}
        disabled={props.disabled ? props.disabled : false}
        value={props.value}
        onChange={e => props.onChange(+e.currentTarget.value)}
      >
        {props.options.map((op, index) => (
          <option key={index} value={op}>
            {op}
          </option>
        ))}
      </select>
    </>
  )
}
