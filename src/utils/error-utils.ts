import { Dispatch } from 'redux'

import { setAppAlertAC, setAppStatusAC } from '../app/app-reducer'
import { AllActionsType } from '../app/store'

export const HandleServerError = (
  dispatch: Dispatch<AllActionsType>,
  message: string = 'Some error, try again'
) => {
  dispatch(setAppStatusAC('failed'))
  dispatch(setAppAlertAC(message, 'error'))
}
