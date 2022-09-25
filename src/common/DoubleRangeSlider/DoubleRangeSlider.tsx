import React, { useState } from 'react'

import s from './DoubleRangeSlider.module.css'

export const DoubleRangeSlider = () => {
  const min = 1
  const max = 100
  const [minVal, setMinVal] = useState(10)
  const [maxVal, setMaxVal] = useState(60)

  const sliderRangeStyle = {
    left: `${(minVal / max) * 100}%`,
    width: `${((max - (max - maxVal) - minVal) / max) * 100}%`,
  }

  return (
    <div className={s.sliderBlockContainer}>
      <div>{minVal}</div>
      <div className={s.sliderContainer}>
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          className={s.thumb + ' ' + s.thumbLeft}
          onChange={event => {
            const value = Math.min(Number(event.target.value), maxVal - 1)

            setMinVal(value)
          }}
          style={{ zIndex: minVal > max - 100 ? '5' : '' }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={event => {
            const value = Math.max(Number(event.target.value), minVal + 1)

            setMaxVal(value)
          }}
          className={s.thumb + ' ' + s.thumbRight}
        />
        <div className={s.slider}>
          <div className={s.sliderTrack} />
          <div style={sliderRangeStyle} className={s.sliderRange} />
        </div>
      </div>
      <div>{maxVal}</div>
    </div>
  )
}
