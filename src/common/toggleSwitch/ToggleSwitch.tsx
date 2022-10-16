import React from 'react'

import s from './ToggleSwitch.module.css'

type PropsType = {
  selected: boolean
  param1: string
  param2: string
  onChange: (value: boolean) => void
  className?: string
  disabled?: boolean
}

export const ToggleSwitch = (props: PropsType) => {
  return (
    <div className={s.toggleSwitch + ' ' + props.className}>
      <div
        className={props.selected ? s.param : s.param + ' ' + s.active}
        onClick={() => !props.disabled && props.onChange(false)}
      >
        {props.param1}
      </div>
      <div
        className={props.selected ? s.param + ' ' + s.active : s.param}
        onClick={() => !props.disabled && props.onChange(true)}
      >
        {props.param2}
      </div>
    </div>
  )
}
