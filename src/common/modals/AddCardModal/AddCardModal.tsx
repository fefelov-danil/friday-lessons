import React, { ReactNode, useState } from 'react'

import DoneOutlineIcon from '@mui/icons-material/DoneOutline'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto'

import { appSetStatusAC } from '../../../app/app-reducer'
import { useAppDispatch } from '../../../app/hooks'
import { addCardTC } from '../../../features/cards/cards-reducer'
import { InputText } from '../../inputText/InputText'
import { ToggleSwitch } from '../../toggleSwitch/ToggleSwitch'
import { UploadImage } from '../../UploadImage/UploadImage'
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
  const [questionWithImage, setQuestionWithImage] = useState(false)
  const [answerWithImage, setAnswerWithImage] = useState(false)
  const [questionImage, setQuestionImage] = useState('')
  const [answerImage, setAnswerImage] = useState('')

  const clearValues = () => {
    setQuestion('')
    setAnswer('')
    setQuestionImage('')
    setAnswerImage('')
  }

  const onAddCardHandler = () => {
    dispatch(appSetStatusAC('loading'))
    dispatch(addCardTC(packId, question, answer, questionImage, answerImage))
    clearValues()
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
    <BasicModal openButton={openButton} acceptButtonTitle="add" callBack={onAddCardHandler}>
      <>
        <h3 className={s.title}>Add card</h3>
        Question:
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
            value={question}
            onChange={e => setQuestion(e.currentTarget.value)}
          />
        )}
        Answer:
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
            value={answer}
            onChange={e => setAnswer(e.currentTarget.value)}
          />
        )}
      </>
    </BasicModal>
  )
}
