import React, { useEffect, useState } from 'react'

import { Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material'
import { useParams } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from 'app/hooks'

const grades = [
  { value: 1, label: 'Did not know' },
  { value: 2, label: 'Forgot' },
  { value: 3, label: 'A lot of thought' },
  { value: 4, label: 'Confused' },
  { value: 5, label: 'Knew the answer' },
]

const getCard = (cards: _CardsType[]) => {
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
  const [isChecked, setIsChecked] = useState(false)
  const [first, setFirst] = useState(true)
  const [value, setValue] = useState('')
  const [grade, setGrade] = useState(0)

  const { packId, packName } = useParams<'packId' | 'packName'>()

  // const {cards} = useAppSelector(state => state.cards)
  const cards: _CardsType[] = []

  // change <_CardsType> to ours <CardsType>
  const [card, setCard] = useState<_CardsType>({
    _id: '0',
    cardsPack_id: '0',
    user_id: '',
    answer: '6',
    question: '2+2*2=?',
    grade: 1,
    shots: 33,
    comments: '',
    type: '',
    rating: 0,
    more_id: '',
    created: '',
    updated: '',
    __v: 0,
    answerImg: '',
    answerVideo: '',
    questionImg: '',
    questionVideo: '',
  })

  useEffect(() => {
    if (first) {
      // packId && dispatch(thunk_creator_get_cards(packId))
      setFirst(false)
    }
    if (cards.length > 0) {
      setCard(getCard(cards))
    }
  }, [dispatch, packId, cards, first])

  const onNextHandle = () => {
    if (packId) {
      setIsChecked(false)
      // dispatch(thunk_creator_that_send_grade(card._id, grade))
      setCard(getCard(cards))
    }
  }

  const onChangeHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value)
  }

  return (
    <div>
      <p>Learn {packName}</p>
      <div>
        <div>Question: {card.question}</div>
        <div>Number of attempts to answer the question: {card.shots}</div>
        {isChecked ? (
          <>
            <div>Answer: {card.answer}</div>
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
              <Button disabled={!value} variant={'contained'} onClick={onNextHandle}>
                next
              </Button>
            </div>
          </>
        ) : (
          <div>
            <Button variant={'contained'} onClick={() => setIsChecked(true)}>
              Show answer
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// temporary type of Cards
type _CardsType = {
  _id: string
  cardsPack_id: string
  user_id: string
  answer: string
  question: string
  grade: number
  shots: number
  comments: string
  type: string
  rating: number
  more_id: string
  created: string
  updated: string
  __v: number
  answerImg: string
  answerVideo: string
  questionImg: string
  questionVideo: string
}
