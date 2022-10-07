import React, { ReactNode, useState } from 'react'

import { appSetStatusAC } from '../../../app/app-reducer'
import { useAppDispatch } from '../../../app/hooks'
import { updatePackTC } from '../../../features/packs/packs-reducer'
import { InputText } from '../../inputText/InputText'
import { BasicModal } from '../BasicModal'

import s from './UpdatePackModal.module.css'

type PropsType = {
  openButton: ReactNode
  name: string
  id: string
  fromCards: boolean
  callBack?: (newName: string) => void
}

export const UpdatePackModal = ({ openButton, name, id, fromCards, callBack }: PropsType) => {
  const dispatch = useAppDispatch()
  const [newTitle, setNewTitle] = useState(name)

  const onUpdatePackHandler = () => {
    dispatch(appSetStatusAC('loading'))
    dispatch(updatePackTC(id, newTitle, fromCards, callBack))
  }

  return (
    <BasicModal openButton={openButton} acceptButtonTitle="save" callBack={onUpdatePackHandler}>
      <>
        <h3 className={s.title}>Change pack name</h3>
        <InputText
          placeholder="Enter new name"
          className={s.input}
          value={newTitle}
          onChange={e => setNewTitle(e.currentTarget.value)}
        />
      </>
    </BasicModal>
  )
}
