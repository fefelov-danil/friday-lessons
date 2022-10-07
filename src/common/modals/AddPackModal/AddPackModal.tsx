import React, { ReactNode, useState } from 'react'

import { appSetStatusAC } from '../../../app/app-reducer'
import { useAppDispatch } from '../../../app/hooks'
import { addPackTC } from '../../../features/packs/packs-reducer'
import { Checkbox } from '../../checkbox/Checkbox'
import { InputText } from '../../inputText/InputText'
import { BasicModal } from '../BasicModal'
import s from '../UpdatePackModal/UpdatePackModal.module.css'

type PropsType = {
  openButton: ReactNode
}

export const AddPackModal = ({ openButton }: PropsType) => {
  const dispatch = useAppDispatch()
  const [packName, setPackName] = useState('')
  const [privatePack, setPrivatePack] = useState(false)

  const onAddPackHandler = () => {
    dispatch(appSetStatusAC('loading'))
    dispatch(addPackTC(packName, privatePack))
    setPackName('')
    setPrivatePack(false)
  }

  return (
    <BasicModal openButton={openButton} acceptButtonTitle="add" callBack={onAddPackHandler}>
      <>
        <h3 className={s.title}>Add pack</h3>
        <InputText
          placeholder="Enter pack name"
          className={s.input}
          value={packName}
          onChange={e => setPackName(e.currentTarget.value)}
        />
        <div className={s.checkBoxContainer}>
          <Checkbox checked={privatePack} onChange={e => setPrivatePack(e.currentTarget.checked)}>
            Private pack
          </Checkbox>
        </div>
      </>
    </BasicModal>
  )
}
