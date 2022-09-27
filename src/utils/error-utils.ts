import { Dispatch } from 'redux'

import { appAlertAC, appSetStatusAC } from '../app/app-reducer'
import { AllActionsType } from '../app/store'

export const HandleServerError = (
  dispatch: Dispatch<AllActionsType>,
  message: string = 'Some error, try again'
) => {
  dispatch(appSetStatusAC('failed'))
  dispatch(appAlertAC(message, 'error'))
}
