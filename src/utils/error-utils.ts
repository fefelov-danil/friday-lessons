import axios, { AxiosError } from 'axios'
import { Dispatch } from 'redux'

import { appAlertAC, appSetStatusAC } from '../app/app-reducer'
import { AllActionsType } from '../app/store'
import { authIsLoggedInAC } from '../features/auth/auth-reducer'

export const handleServerError = (
  e: Error | AxiosError<{ error: string }>,
  dispatch: Dispatch<AllActionsType>
) => {
  const err = e as Error | AxiosError<{ error: string }>

  if (axios.isAxiosError(err)) {
    const error = err.response?.data
      ? (err.response.data as { error: string }).error
      : 'Some error, try again'

    if (err.response?.status === 401) {
      dispatch(authIsLoggedInAC(false))
    }

    dispatch(appAlertAC(error, 'error'))
  } else {
    dispatch(appAlertAC('Some error, try again', 'error'))
  }
  dispatch(appSetStatusAC('failed'))
}
