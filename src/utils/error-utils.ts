import axios, { AxiosError } from 'axios'

import { appAlertAC, appSetStatusAC } from '../app/app-reducer'
import { setIsLoggedIn } from '../features/auth/auth-reducer'

import { AppDispatch } from 'app/store'

export const handleServerError = (
  e: Error | AxiosError<{ error: string }>,
  dispatch: AppDispatch
) => {
  const err = e as Error | AxiosError<{ error: string }>
  console.log(err);
  
  if (axios.isAxiosError(err)) {
    const error = err.response?.data
      ? (err.response.data as { error: string }).error
      : 'Some error, try again'

    if (err.response?.status === 401) {
      dispatch(setIsLoggedIn(false))
    }

    dispatch(appAlertAC({ message: error, type: 'error' }))
  } else {
    dispatch(appAlertAC({ message: 'Some error, try again', type: 'error' }))
  }
  dispatch(appSetStatusAC('failed'))
}
