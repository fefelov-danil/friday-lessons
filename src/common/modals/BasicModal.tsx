import React, { ReactNode, useState } from 'react'

import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'

import { Button } from '../button/Button'

import s from './BasicModal.module.css'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
}

type PropsType = {
  children: ReactNode
  openButton: ReactNode
  acceptButtonTitle: ReactNode
  callBack: () => void
}

export const BasicModal = ({ children, openButton, acceptButtonTitle, callBack }: PropsType) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const onClickHandler = () => {
    handleClose()
    callBack()
  }

  return (
    <div>
      <span onClick={handleOpen}>{openButton}</span>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={s.style}>
          {children}
          <div className={s.buttonsContainer}>
            <Button onClick={handleClose} className={s.cancelButton}>
              Cancel
            </Button>
            <Button onClick={onClickHandler}>{acceptButtonTitle}</Button>
          </div>
        </Box>
      </Modal>
    </div>
  )
}
