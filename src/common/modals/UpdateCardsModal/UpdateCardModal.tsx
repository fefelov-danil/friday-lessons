import React, { ReactNode, useState } from 'react'

import DoneOutlineIcon from '@mui/icons-material/DoneOutline'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto'

import { appSetStatusAC } from '../../../app/app-reducer'
import { useAppDispatch } from '../../../app/hooks'
import { updateCardTC } from '../../../features/cards/cards-reducer'
import { InputText } from '../../inputText/InputText'
import { ToggleSwitch } from '../../toggleSwitch/ToggleSwitch'
import { UploadImage } from '../../UploadImage/UploadImage'
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
  const [questionWithImage, setQuestionWithImage] = useState(false)
  const [answerWithImage, setAnswerWithImage] = useState(false)
  const [questionImage, setQuestionImage] = useState('')
  const [answerImage, setAnswerImage] = useState('')

  const onUpdateCardHandler = () => {
    dispatch(appSetStatusAC('loading'))
    dispatch(updateCardTC(id, newQuestion, newAnswer, questionImage, answerImage))
  }

  let questionInputText

  if (questionImage === '') {
    questionInputText = (
      <>
        <InsertPhotoIcon />
        choose file
      </>
    )
  } else {
    questionInputText = (
      <>
        <DoneOutlineIcon />
        file uploaded
      </>
    )
  }

  let answerInputText

  if (answerImage === '') {
    answerInputText = (
      <>
        <InsertPhotoIcon />
        choose file
      </>
    )
  } else {
    answerInputText = (
      <>
        <DoneOutlineIcon />
        file uploaded
      </>
    )
  }

  return (
    <BasicModal openButton={openButton} acceptButtonTitle="save" callBack={onUpdateCardHandler}>
      <>
        <h3 className={s.title}>Change card</h3>
        New question:
        <ToggleSwitch
          selected={questionWithImage}
          param1="Text"
          param2="Image"
          onChange={setQuestionWithImage}
          className={s.switch}
        />
        {questionWithImage ? (
          <UploadImage callBackFn={setQuestionImage}>
            <div className={s.addImage}>{questionInputText}</div>
          </UploadImage>
        ) : (
          <InputText
            placeholder="Enter question"
            className={s.input}
            value={newQuestion}
            onChange={e => setNewQuestion(e.currentTarget.value)}
          />
        )}
        New answer:
        <ToggleSwitch
          selected={answerWithImage}
          param1="Text"
          param2="Image"
          onChange={setAnswerWithImage}
          className={s.switch}
        />
        {answerWithImage ? (
          <UploadImage callBackFn={setAnswerImage}>
            <div className={s.addImage}>{answerInputText}</div>
          </UploadImage>
        ) : (
          <InputText
            placeholder="Enter answer"
            className={s.input}
            value={newAnswer}
            onChange={e => setNewAnswer(e.currentTarget.value)}
          />
        )}
      </>
    </BasicModal>
  )
}
