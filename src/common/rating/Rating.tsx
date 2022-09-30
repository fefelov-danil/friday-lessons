import React from 'react'

import s from './Rating.module.css'

type PropsType = {
  value: number
}

export const Rating = (props: PropsType) => {
  const stars = [1, 2, 3, 4, 5]
  let value = Math.round(props.value)

  return (
    <div className={s.rating}>
      {stars.map(st => {
        return <div key={st} className={value > st - 1 ? `${s.active} ${s.star}` : s.star}></div>
      })}
    </div>
  )
}
