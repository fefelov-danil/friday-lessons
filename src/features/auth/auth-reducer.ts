import { Dispatch } from 'redux'

import { setAppAuthLoadingAC, setAppErrorAC, setAppStatusAC } from 'app/app-reducer'
import { AllActionsType } from 'app/store'
import {
  authAPI,
  changePasswordType,
  forgotPasswordValuesType,
  loginValuesType,
} from 'features/auth/auth-API'

const initialState: AuthStateType = {
  isLoggedIn: false,
  isVerifyLogin: false,
  checkEmailRedirect: false,
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
    case 'login/USER':
      return { ...state, user: action.user }
    case 'login/CHECK-EMAIL-REDIRECT':
      return { ...state, checkEmailRedirect: action.redirect }
    case 'login/CHANGE-PASSWORD':
      return { ...state, changePassword: action.forResetPass }
    default:
      return state
  }
}

// Actions
export const loginAC = (isLoggedIn: boolean) => ({ type: 'login/LOGIN', isLoggedIn } as const)
export const verifyLoginAC = (isVerifyLogin: boolean) =>
  ({ type: 'login/VERIFY-LOGIN', isVerifyLogin } as const)
export const userAC = (user: UserType) => ({ type: 'login/USER', user } as const)
export const checkEmailRedirectAC = (redirect: boolean) =>
  ({ type: 'login/CHECK-EMAIL-REDIRECT', redirect } as const)
export const changePasswordAC = (forResetPass: changePasswordType) =>
  ({ type: 'login/CHANGE-PASSWORD', forResetPass } as const)

// Thunks
export const loginTC = (values: loginValuesType) => (dispatch: Dispatch<AllActionsType>) => {
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

export const isAuthLoadingTC = () => (dispatch: Dispatch<AllActionsType>) => {
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

export const forgotPasswordTC =
  (values: forgotPasswordValuesType) => (dispatch: Dispatch<AllActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.forgotPassword(values).then(res => {
      dispatch(checkEmailRedirectAC(true))
      dispatch(setAppStatusAC('succeeded'))
    })
  }

export const changePasswordTC =
  (values: changePasswordType) => (dispatch: Dispatch<AllActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI
      .changePassword(values)
      .then(res => {
        dispatch(setAppStatusAC('succeeded'))
      })
      .catch(err => {
        dispatch(setAppErrorAC(err.message))
        dispatch(setAppStatusAC('failed'))
      })
  }

// потом убрать
export const deleteMe = () => (dispatch: Dispatch) => {
  authAPI.deleteMe().then(res => {
    console.log(res)
  })
}

// Types
type AuthStateType = {
  isLoggedIn: boolean
  isVerifyLogin: boolean
  checkEmailRedirect: boolean
  changePassword?: changePasswordType
  user?: UserType
}
type UserType = {
  _id: string
  email: string
  name: string
  avatar?: string
  publicCardPacksCount: number
  created: Date
  updated: Date
  isAdmin: boolean
  verified: boolean // подтвердил ли почту
  rememberMe: boolean

  error?: string
}

export type AuthActionsType =
  | ReturnType<typeof loginAC>
  | ReturnType<typeof verifyLoginAC>
  | ReturnType<typeof userAC>
  | ReturnType<typeof checkEmailRedirectAC>
  | ReturnType<typeof changePasswordAC>
