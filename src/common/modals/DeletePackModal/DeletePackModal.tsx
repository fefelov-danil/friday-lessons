import React, { ReactNode } from 'react'

import { appSetStatusAC } from '../../../app/app-reducer'
import { useAppDispatch } from '../../../app/hooks'
import { deletePackTC } from '../../../features/packs/packs-reducer'
import { BasicModal } from '../BasicModal'

import s from './DeletePackModal.module.css'

type PropsType = {
  openButton: ReactNode
  title: string
  id: string
  fromCards: boolean
  callBack?: () => void
}

export const DeletePackModal = ({ openButton, title, id, fromCards, callBack }: PropsType) => {
  const dispatch = useAppDispatch()

  const onDeletePackHandler = () => {
    dispatch(appSetStatusAC('loading'))
    dispatch(deletePackTC(id, fromCards, callBack))
  }

  return (
    <BasicModal openButton={openButton} acceptButtonTitle="delete" callBack={onDeletePackHandler}>
      <>
        <h3 className={s.title}>Delete pack</h3>
        <p className={s.title}>You sure you want to delete &quot;{title}&quot; pack?</p>
      </>
    </BasicModal>
  )
}
