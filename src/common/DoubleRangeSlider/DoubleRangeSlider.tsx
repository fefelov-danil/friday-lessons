import React from 'react'

import s from './DoubleRangeSlider.module.css'

type PropsType = {
  min: number
  max: number
  minVal: number
  maxVal: number
  setMinVal: (min: number) => void
  setMaxVal: (max: number) => void
}

export const DoubleRangeSlider = (props: PropsType) => {
  const sliderRangeStyle = {
    left: `${(props.minVal / props.max) * 100}%`,
    width: `${((props.max - (props.max - props.maxVal) - props.minVal) / props.max) * 100}%`,
  }

  return (
    <div className={s.sliderBlockContainer}>
      <p className={s.sliderVal}>{props.minVal}</p>
      <div className={s.sliderContainer}>
        <input
          type="range"
          min={props.min}
          max={props.max}
          value={props.minVal}
          className={s.thumb + ' ' + s.thumbLeft}
          onChange={event => {
            const value = Math.min(Number(event.target.value), props.maxVal - 1)

            props.setMinVal(value)
          }}
          style={{ zIndex: props.minVal > props.max - 100 ? '5' : '' }}
        />
        <input
          type="range"
          min={props.min}
          max={props.max}
          value={props.maxVal}
          onChange={event => {
            const value = Math.max(Number(event.target.value), props.minVal + 1)

            props.setMaxVal(value)
          }}
          className={s.thumb + ' ' + s.thumbRight}
        />
        <div className={s.slider}>
          <div className={s.sliderTrack} />
          <div style={sliderRangeStyle} className={s.sliderRange} />
        </div>
      </div>
      <p className={s.sliderVal}>{props.maxVal}</p>
    </div>
  )
}
