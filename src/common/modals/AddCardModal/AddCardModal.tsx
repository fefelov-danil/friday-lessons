import React, { ReactNode, useState } from 'react'

import { appSetStatusAC } from '../../../app/app-reducer'
import { useAppDispatch } from '../../../app/hooks'
import { addCardTC } from '../../../features/cards/cards-reducer'
import { InputText } from '../../inputText/InputText'
import { BasicModal } from '../BasicModal'

import s from './AddCardModal.module.css'

type PropsType = {
  packId: string
  openButton: ReactNode
}

export const AddPackModal = ({ openButton, packId }: PropsType) => {
  const dispatch = useAppDispatch()
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  const onAddCardHandler = () => {
    dispatch(appSetStatusAC('loading'))
    dispatch(addCardTC(packId, question, answer))
    setQuestion('')
    setAnswer('')
  }

  return (
    <BasicModal openButton={openButton} acceptButtonTitle="add" callBack={onAddCardHandler}>
      <>
        <h3 className={s.title}>Add pack</h3>
        <InputText
          placeholder="Enter question"
          className={s.input}
          value={question}
          onChange={e => setQuestion(e.currentTarget.value)}
        />
        <InputText
          placeholder="Enter answer"
          className={s.input}
          value={answer}
          onChange={e => setAnswer(e.currentTarget.value)}
        />
      </>
    </BasicModal>
  )
}
