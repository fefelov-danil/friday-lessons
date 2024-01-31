import React, { ChangeEvent } from 'react'

import { appAlertAC } from 'app/app-reducer'
import { useAppDispatch } from 'app/hooks'
import { convertFileToBase64 } from 'utils/convertFileToBase64'

type UploadImagePropsType = {
  callBackFn: (image: string) => void
  children: React.ReactNode
}

export const UploadImage: React.FC<UploadImagePropsType> = ({ callBackFn, children }) => {
  const dispatch = useAppDispatch()

  const uploadHandler = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length) {
      const file = e.target.files && e.target.files[0]

      if (file.size < 400000) {
        convertFileToBase64(file, (file64: string) => {
          callBackFn(file64)
        })
      } else {
        dispatch(appAlertAC({ message: 'Incorrect file size or type', type: 'error' }))
      }
    }
  }

  return (
    <div>
      <label htmlFor="icon-button-photo">
        <input
          style={{ display: 'none' }}
          type="file"
          accept="image/*"
          onChange={uploadHandler}
          id="icon-button-photo"
        />
        {children}
      </label>
    </div>
  )
}
