import React, { ReactNode } from 'react'

import { appSetStatusAC } from '../../../app/app-reducer'
import { useAppDispatch } from '../../../app/hooks'
import { deleteCardTC } from '../../../features/cards/cards-reducer'
import { BasicModal } from '../BasicModal'

import s from './DeleteCardModal.module.css'

type PropsType = {
  openButton: ReactNode
  title: string
  id: string
}

export const DeleteCardModal = ({ openButton, title, id }: PropsType) => {
  const dispatch = useAppDispatch()

  const onDeletePackHandler = () => {
    dispatch(appSetStatusAC('loading'))
    dispatch(deleteCardTC(id))
  }

  return (
    <BasicModal openButton={openButton} acceptButtonTitle="delete" callBack={onDeletePackHandler}>
      <>
        <h3 className={s.title}>Delete card</h3>
        <p className={s.title}>You sure you want to delete &quot;{title}&quot; card?</p>
      </>
    </BasicModal>
  )
}
