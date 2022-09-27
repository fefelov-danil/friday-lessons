import { Dispatch } from 'redux'

import { appAlertAC, appSetLoadingAC, appSetStatusAC } from 'app/app-reducer'
import { AllActionsType } from 'app/store'
import {
  authAPI,
  changePasswordType,
  forgotPasswordValuesType,
  loginValuesType,
  registrationValuesType,
} from 'features/auth/auth-API'
import { HandleServerError } from 'utils/error-utils'

const authInitialState = {
  isLoggedIn: false,
  checkEmailRedirect: false,
  isPasswordChanged: false,
  isRegistered: false,
  changePassword: null as null | changePasswordType,
  user: null as null | UserType,
}

export const authReducer = (
  state: AuthStateType = authInitialState,
  action: AuthActionsType
): AuthStateType => {
  switch (action.type) {
    case 'auth/VERIFY-LOGIN':
      return { ...state, isLoggedIn: action.isLoggedIn }
    case 'auth/IS-REGISTERED':
      return { ...state, isRegistered: action.isRegistered }
    case 'auth/SET-USER':
      if (!action.user.avatar) {
        action.user.avatar =
          'https://www.gravatar.com/avatar/ca6f903ac1e11977898f9b0c9b3d5292.jpg?size=240&d=https%3A%2F%2Fwww.artstation.com%2Fassets%2Fdefault_avatar.jpg'
      }

      return { ...state, user: action.user }
    case 'auth/DELETE-USER':
      return { ...state, user: null }
    case 'auth/CHECK-EMAIL-REDIRECT':
      return { ...state, checkEmailRedirect: action.checkEmailRedirect }
    case 'auth/CHANGE-PASSWORD':
      return { ...state, changePassword: action.changePassword }
    case 'auth/IS-PASSWORD-CHANGED':
      return { ...state, isPasswordChanged: action.isPasswordChanged }

    default:
      return state
  }
}

// Actions
export const authIsLoggedInAC = (isLoggedIn: boolean) =>
  ({ type: 'auth/VERIFY-LOGIN', isLoggedIn } as const)
export const authIsRegisteredAC = (isRegistered: boolean) =>
  ({ type: 'auth/IS-REGISTERED', isRegistered } as const)
export const authUserAC = (user: UserType) => ({ type: 'auth/SET-USER', user } as const)
export const authCheckEmailRedirectAC = (checkEmailRedirect: boolean) =>
  ({ type: 'auth/CHECK-EMAIL-REDIRECT', checkEmailRedirect } as const)
export const authChangePasswordAC = (changePassword: changePasswordType) =>
  ({ type: 'auth/CHANGE-PASSWORD', changePassword } as const)
export const authIsPasswordChangedAC = (isPasswordChanged: boolean) =>
  ({ type: 'auth/IS-PASSWORD-CHANGED', isPasswordChanged } as const)
export const authDeleteUserAC = () =>
  ({
    type: 'auth/DELETE-USER',
  } as const)

// Thunks
export const registrationTC =
  (values: registrationValuesType) => (dispatch: Dispatch<AllActionsType>) => {
    dispatch(appSetStatusAC('loading'))
    authAPI
      .registration(values)
      .then(res => {
        dispatch(authIsRegisteredAC(true))
        dispatch(appSetStatusAC('succeeded'))
      })
      .catch(err => {
        if (err.response) {
          HandleServerError(dispatch, err.response.data.error)
        }
      })
  }

export const loginTC = (values: loginValuesType) => (dispatch: Dispatch<AllActionsType>) => {
  dispatch(appSetStatusAC('loading'))
  authAPI
    .login(values)
    .then(res => {
      dispatch(appSetStatusAC('succeeded'))
      dispatch(authIsLoggedInAC(true))
      dispatch(authUserAC(res.data))
    })
    .catch(err => {
      if (err.response) {
        HandleServerError(dispatch, err.response.data.error)
      }
    })
}

export const isAuthLoadingTC = () => (dispatch: Dispatch<AllActionsType>) => {
  authAPI
    .authMe()
    .then(res => {
      dispatch(appSetLoadingAC(false))
      dispatch(authIsLoggedInAC(true))
      dispatch(authUserAC(res.data))
    })
    .catch(err => {
      if (err.response) {
        dispatch(appSetLoadingAC(false))
      }
    })
}

export const forgotPasswordTC =
  (values: forgotPasswordValuesType) => (dispatch: Dispatch<AllActionsType>) => {
    dispatch(appSetStatusAC('loading'))
    authAPI
      .forgotPassword(values)
      .then(res => {
        dispatch(authCheckEmailRedirectAC(true))
        dispatch(appSetStatusAC('succeeded'))
      })
      .catch(err => {
        if (err.response) {
          HandleServerError(dispatch, err.response.data.error)
        }
      })
  }

export const changePasswordTC =
  (values: changePasswordType) => async (dispatch: Dispatch<AllActionsType>) => {
    dispatch(appSetStatusAC('loading'))
    authAPI
      .changePassword(values)
      .then(res => {
        dispatch(appSetStatusAC('succeeded'))
        dispatch(authIsPasswordChangedAC(true))
        dispatch(appAlertAC('Password successfully changed', 'success'))
      })
      .catch(err => {
        if (err.response) {
          HandleServerError(dispatch, err.response.data.error)
        }
      })
  }

export const logoutTC = () => async (dispatch: Dispatch<AllActionsType>) => {
  dispatch(appSetStatusAC('loading'))
  try {
    await authAPI.logout()

    dispatch(authIsLoggedInAC(false))
    dispatch(authDeleteUserAC())
    dispatch(appSetStatusAC('succeeded'))
  } catch (err) {
    // @ts-ignore
    if (err.response) {
      // @ts-ignore
      HandleServerError(dispatch, err.response.data.error)
    }
  }
}
export const changeUsernameTC = (name: string) => async (dispatch: Dispatch<AllActionsType>) => {
  dispatch(appSetStatusAC('loading'))
  try {
    const res = await authAPI.changeUsername(name)

    dispatch(authUserAC(res.data.updatedUser))
    dispatch(appSetStatusAC('succeeded'))
    dispatch(appAlertAC('Name successfully changed', 'success'))
  } catch (err) {
    // @ts-ignore
    if (err.response) {
      // @ts-ignore
      HandleServerError(dispatch, err.response.data.error)
    }
  }
}

// Types
type AuthStateType = typeof authInitialState

export type UserType = {
  avatar: string
  created: string
  email: string
  isAdmin: boolean
  name: string
  publicCardPacksCount: number
  rememberMe: boolean
  token: string
  tokenDeathTime: number
  updated: string
  verified: boolean
  __v: number
  _id: string
}

export type AuthActionsType =
  | ReturnType<typeof authIsLoggedInAC>
  | ReturnType<typeof authIsRegisteredAC>
  | ReturnType<typeof authUserAC>
  | ReturnType<typeof authCheckEmailRedirectAC>
  | ReturnType<typeof authChangePasswordAC>
  | ReturnType<typeof authIsPasswordChangedAC>
  | ReturnType<typeof authDeleteUserAC>
