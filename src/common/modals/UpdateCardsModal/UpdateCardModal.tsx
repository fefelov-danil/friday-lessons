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
  questionImg: string
  answerImg: string
}

export const UpdateCardModal = ({
  openButton,
  id,
  question,
  answer,
  questionImg,
  answerImg,
}: PropsType) => {
  const dispatch = useAppDispatch()
  const [newQuestion, setNewQuestion] = useState(question)
  const [newAnswer, setNewAnswer] = useState(answer)
  const [questionWithImage, setQuestionWithImage] = useState(!!questionImg)
  const [answerWithImage, setAnswerWithImage] = useState(!!answerImg)
  const [questionImage, setQuestionImage] = useState(questionImg)
  const [answerImage, setAnswerImage] = useState(answerImg)

  const onUpdateCardHandler = () => {
    dispatch(appSetStatusAC('loading'))
    dispatch(updateCardTC(id, newQuestion, newAnswer, questionImage, answerImage))
  }

  let questionInputText

  if (questionImage === '') {
    questionInputText = (
      <div className={s.addImage}>
        <InsertPhotoIcon />
        choose file
      </div>
    )
  } else {
    questionInputText = (
      <div className={s.image} style={{ backgroundImage: `url(${questionImage})` }}>
        <p className={s.uploadContainer}>
          <InsertPhotoIcon />
          click here to upload new file
        </p>
      </div>
    )
  }

  let answerInputText

  if (answerImage === '') {
    answerInputText = (
      <div className={s.addImage}>
        <InsertPhotoIcon />
        choose file
      </div>
    )
  } else {
    answerInputText = (
      <div className={s.image} style={{ backgroundImage: `url(${answerImage})` }}>
        <p className={s.uploadContainer}>
          <InsertPhotoIcon />
          click here to upload new file
        </p>
      </div>
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
          <UploadImage callBackFn={setQuestionImage}>{questionInputText}</UploadImage>
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
          <UploadImage callBackFn={setAnswerImage}>{answerInputText}</UploadImage>
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
