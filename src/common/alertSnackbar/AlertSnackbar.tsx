import * as React from 'react'

import MuiAlert, { AlertProps } from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

import { appAlertAC } from 'app/app-reducer'
import { useAppDispatch, useAppSelector } from 'app/hooks'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function AlertSnackbar() {
  const dispatch = useAppDispatch()
  const alert = useAppSelector(state => state.app.appAlert)

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }
    dispatch(appAlertAC(null, null))
  }

  return (
    <Snackbar open={!!alert.type} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={alert.type || 'success'} sx={{ width: '100%' }}>
        {alert.message}
      </Alert>
    </Snackbar>
  )
}
