import { Dispatch } from 'redux'

import { setAppAuthLoadingAC, setAppErrorAC, setAppStatusAC } from 'app/app-reducer'
import { AllActionsType } from 'app/store'
import { authAPI, loginValues } from 'features/auth/auth-API'

const initialState = {
  isLoggedIn: false,
  isVerifyLogin: false,
}

export const authReducer = (
  state: AuthStateType = initialState,
  action: AuthActionsType
): AuthStateType => {
  switch (action.type) {
    case 'login/LOGIN':
      return { ...state, isLoggedIn: action.isLoggedIn }
    case 'login/VERIFY-LOGIN':
      return { ...state, isVerifyLogin: action.isVerifyLogin }
    default:
      return state
  }
}

// Actions
export const loginAC = (isLoggedIn: boolean) => ({ type: 'login/LOGIN', isLoggedIn } as const)
export const verifyLoginAC = (isVerifyLogin: boolean) =>
  ({ type: 'login/VERIFY-LOGIN', isVerifyLogin } as const)

// Thunks
export const loginTC = (values: loginValues) => (dispatch: Dispatch<AllActionsType>) => {
  dispatch(setAppStatusAC('loading'))
  authAPI
    .login(values)
    .then(res => {
      dispatch(setAppStatusAC('succeeded'))
      dispatch(loginAC(true))
      dispatch(verifyLoginAC(true))
    })
    .catch(err => {
      dispatch(setAppStatusAC('failed'))
      dispatch(setAppErrorAC(err.message))
    })
}

export const isAuthLoadingTC = () => (dispatch: Dispatch) => {
  authAPI
    .authMe()
    .then(res => {
      dispatch(setAppAuthLoadingAC(false))
      dispatch(verifyLoginAC(true))
    })
    .catch(err => {
      dispatch(setAppAuthLoadingAC(false))
      dispatch(loginAC(false))
    })
}

// Types
type AuthStateType = typeof initialState

export type AuthActionsType = ReturnType<typeof loginAC> | ReturnType<typeof verifyLoginAC>
