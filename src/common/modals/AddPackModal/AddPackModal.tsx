import React, { ReactNode, useEffect, useState } from 'react'

import { Avatar, Button } from '@mui/material'

import { appSetStatusAC } from '../../../app/app-reducer'
import { useAppDispatch } from '../../../app/hooks'
import { addPackThunk } from '../../../features/packs/packs-reducer'
import { Checkbox } from '../../checkbox/Checkbox'
import { InputText } from '../../inputText/InputText'
import { UploadImage } from '../../UploadImage/UploadImage'
import { BasicModal } from '../BasicModal'
import s from '../UpdatePackModal/UpdatePackModal.module.css'

type PropsType = {
  openButton: ReactNode
}

export const AddPackModal = ({ openButton }: PropsType) => {
  const dispatch = useAppDispatch()
  const [packName, setPackName] = useState('')
  const [privatePack, setPrivatePack] = useState(false)
  const [newCover, setNewCover] = useState('')

  const onAddPackHandler = () => {
    dispatch(appSetStatusAC('loading'))
    dispatch(addPackThunk({name: packName, deckCover: newCover, privatePack}))
    setPackName('')
    setPrivatePack(false)
    setNewCover('')
  }

  return (
    <BasicModal openButton={openButton} acceptButtonTitle="add" callBack={onAddPackHandler}>
      <div className={s.container}>
        <h3 className={s.title}>Add pack</h3>
        <InputText
          placeholder="Enter pack name"
          className={s.input}
          value={packName}
          onChange={e => setPackName(e.currentTarget.value)}
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
        <div className={s.checkBoxContainer}>
          <Checkbox checked={privatePack} onChange={e => setPrivatePack(e.currentTarget.checked)}>
            Private pack
          </Checkbox>
        </div>
      </div>
    </BasicModal>
  )
}
