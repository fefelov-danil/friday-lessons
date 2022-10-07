import React, { useEffect, useState } from 'react'

import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { useParams } from 'react-router-dom'

import s from './Learning.module.css'

import { appSetStatusAC } from 'app/app-reducer'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import { BackArrowButton } from 'common/BackArrowButton/BackArrowButton'
import { Button } from 'common/button/Button'
import { CardType, getCardsTC, updateCardGradeTC } from 'features/cards/cards-reducer'

const grades = [
  { value: 1, label: 'Did not know' },
  { value: 2, label: 'Forgot' },
  { value: 3, label: 'A lot of thought' },
  { value: 4, label: 'Confused' },
  { value: 5, label: 'Knew the answer' },
]

// clever Random by IgnatZakalinsky
const getCard = (cards: CardType[]) => {
  const sum = cards.reduce((acc, card) => acc + (6 - card.grade) * (6 - card.grade), 0)
  const rand = Math.random() * sum
  const res = cards.reduce(
    (acc: { sum: number; id: number }, card, i) => {
      const newSum = acc.sum + (6 - card.grade) * (6 - card.grade)

      return { sum: newSum, id: newSum < rand ? i : acc.id }
    },
    { sum: 0, id: -1 }
  )

  return cards[res.id + 1]
}

export const Learning = () => {
  const dispatch = useAppDispatch()
  const { packId, packName } = useParams<'packId' | 'packName'>()
  const [isChecked, setIsChecked] = useState(false)
  const [first, setFirst] = useState(true)
  const [value, setValue] = useState('')
  const [grade, setGrade] = useState(0)

  const cards = useAppSelector(state => state.cards.cards)
  const filters = useAppSelector(state => state.cards.filters)
  const isLoading = 'loading' === useAppSelector(state => state.app.appStatus)

  const [card, setCard] = useState<CardType>({
    answer: '',
    question: '',
    cardsPack_id: '',
    grade: 0,
    shots: 0,
    user_id: '',
    created: '',
    updated: '',
    _id: '',
  })

  useEffect(() => {
    if (first) {
      dispatch(appSetStatusAC('loading'))
      packId && dispatch(getCardsTC(packId, { ...filters, pageCount: 100 }))
      setFirst(false)
    }
    if (cards.length > 0) {
      setCard(getCard(cards))
    }
  }, [dispatch, packId, cards, first])

  const onNextHandle = () => {
    if (packId) {
      dispatch(appSetStatusAC('loading'))
      setIsChecked(false)
      dispatch(updateCardGradeTC(grade, card._id))
      setValue('')
      setCard(getCard(cards))
    }
  }

  const onChangeHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value)
  }

  return (
    <div className={'formPage' + ' ' + s.learningContainer}>
      <div className={s.arrowButton}>
        <BackArrowButton title="Cards List" packData={{ packId, packName }} />
      </div>
      <div className={'formContainer'}>
        <h4 className={s.packName}>Learn “{packName}”</h4>
        <div>
          <div className={s.questionContainer}>
            <p className={s.questionText}>Question:&nbsp;</p>
            <p>{card.question}</p>
          </div>
          <div className={s.shotsContainer}>
            <p>Number of attempts to answer the question: {card.shots}</p>
          </div>
          {isChecked ? (
            <>
              <div className={s.questionContainer}>
                <p className={s.questionText}>Answer:&nbsp;</p>
                <p>{card.answer}</p>
              </div>
              <div>
                <FormControl>
                  <FormLabel>Rate yourself:</FormLabel>
                  <RadioGroup value={value} onChange={onChangeHandle}>
                    {grades.map((grade, i) => (
                      <FormControlLabel
                        key={'grade-' + i}
                        value={grade.value}
                        control={<Radio onChange={() => setGrade(grade.value)} />}
                        label={grade.label}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
              <div>
                <Button
                  disabled={!value}
                  onClick={onNextHandle}
                  className={value ? s.enabledBtn : s.disabledBtn}
                >
                  next
                </Button>
              </div>
            </>
          ) : (
            <div>
              <Button
                onClick={() => setIsChecked(true)}
                disabled={isLoading}
                className={s.enabledBtn}
              >
                Show answer
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
