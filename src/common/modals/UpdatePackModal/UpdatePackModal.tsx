import React, { ReactNode, useState } from 'react'

import { Avatar, Button } from '@mui/material'

import { appSetStatusAC } from '../../../app/app-reducer'
import { useAppDispatch } from '../../../app/hooks'
import { updatePackTC } from '../../../features/packs/packs-reducer'
import { InputText } from '../../inputText/InputText'
import { BasicModal } from '../BasicModal'

import s from './UpdatePackModal.module.css'

import { UploadImage } from 'common/UploadImage/UploadImage'

type PropsType = {
  openButton: ReactNode
  name: string
  id: string
  deckCover: string
  fromCards: boolean
  callBack?: (newName: string) => void
}

export const UpdatePackModal = ({
  openButton,
  name,
  id,
  deckCover,
  fromCards,
  callBack,
}: PropsType) => {
  const dispatch = useAppDispatch()
  const [newTitle, setNewTitle] = useState(name)
  const [newCover, setNewCover] = useState(deckCover)

  const onUpdatePackHandler = () => {
    dispatch(appSetStatusAC('loading'))
    dispatch(updatePackTC(id, newTitle, newCover, fromCards, callBack))
    setNewTitle('')
    setNewCover('')
  }

  return (
    <BasicModal openButton={openButton} acceptButtonTitle="save" callBack={onUpdatePackHandler}>
      <div className={s.container}>
        <h3 className={s.title}>Edit pack</h3>
        <InputText
          placeholder="Enter new name"
          className={s.input}
          value={newTitle}
          onChange={e => setNewTitle(e.currentTarget.value)}
        />
        <UploadImage callBackFn={setNewCover}>
          <Button component="span" variant="contained" style={{ background: '#f8686e' }}>
            upload cover
          </Button>
        </UploadImage>
        {newCover && (
          <Avatar
            alt="cover"
            src={newCover || ''}
            sx={{ width: 140, height: 140 }}
            variant="square"
          />
        )}
      </div>
    </BasicModal>
  )
}
