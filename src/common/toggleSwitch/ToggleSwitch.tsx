import React from 'react'

import s from './ToggleSwitch.module.css'

type PropsType = {
  selected?: boolean
  param1: string
  param2: string
  onChange: (value: boolean) => void
  className?: string
  disabled?: boolean
}

export const ToggleSwitch = (props: PropsType) => {
  const selection = props.selected === undefined 
  return (
    <div className={s.toggleSwitch + ' ' + props.className}>
      <div
        className={selection ? s.param : (!props.selected ? s.param + ' ' + s.active : s.param)}
        onClick={() => !props.disabled && props.onChange(false)}
      >
        {props.param1}
      </div>
      <div
        className={selection ? s.param : (props.selected ? s.param + ' ' + s.active : s.param)}
        onClick={() => !props.disabled && props.onChange(true)}
      >
        {props.param2}
      </div>
    </div>
  )
}
