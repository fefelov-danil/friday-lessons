import React, { ReactNode, useState } from 'react'

import { appSetStatusAC } from '../../../app/app-reducer'
import { useAppDispatch } from '../../../app/hooks'
import { updateCardTC } from '../../../features/cards/cards-reducer'
import { InputText } from '../../inputText/InputText'
import { BasicModal } from '../BasicModal'

import s from './UpdateCardModal.module.css'

type PropsType = {
  openButton: ReactNode
  id: string
  question: string
  answer: string
}

export const UpdateCardModal = ({ openButton, id, question, answer }: PropsType) => {
  const dispatch = useAppDispatch()
  const [newQuestion, setNewQuestion] = useState(question)
  const [newAnswer, setNewAnswer] = useState(answer)

  const onUpdateCardHandler = () => {
    dispatch(appSetStatusAC('loading'))
    dispatch(updateCardTC(id, newQuestion, newAnswer))
  }

  return (
    <BasicModal openButton={openButton} acceptButtonTitle="save" callBack={onUpdateCardHandler}>
      <>
        <h3 className={s.title}>Change question or answer</h3>
        <InputText
          placeholder="Enter new question"
          className={s.input}
          value={newQuestion}
          onChange={e => setNewQuestion(e.currentTarget.value)}
        />
        <InputText
          placeholder="Enter new answer"
          className={s.input}
          value={newAnswer}
          onChange={e => setNewAnswer(e.currentTarget.value)}
        />
      </>
    </BasicModal>
  )
}
