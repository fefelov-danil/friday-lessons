import { AxiosError } from 'axios'
import { Dispatch } from 'redux'

import { appAlertAC, appSetLoadingAC, appSetStatusAC } from 'app/app-reducer'
import { AllActionsType } from 'app/store'
import {
  AnotherUserType,
  authAPI,
  changePasswordType,
  forgotPasswordValuesType,
  loginValuesType,
  registrationValuesType,
} from 'features/auth/auth-API'
import { handleServerError } from 'utils/error-utils'

const authInitialState = {
  isLoggedIn: false,
  checkEmailRedirect: false,
  isPasswordChanged: false,
  isRegistered: false,
  changePassword: null as null | changePasswordType,
  user: null as null | UserType,
  guestUser: null as null | AnotherUserType,
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
    case 'auth/SET-GUEST-USER-PROFILE':
      return { ...state, guestUser: action.user }

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
export const setUserProfileAC = (user: AnotherUserType) =>
  ({ type: 'auth/SET-GUEST-USER-PROFILE', user } as const)

// Thunks
export const registrationTC =
  (values: registrationValuesType) => async (dispatch: Dispatch<AllActionsType>) => {
    dispatch(appSetStatusAC('loading'))
    try {
      await authAPI.registration(values)

      dispatch(authIsRegisteredAC(true))
      dispatch(appSetStatusAC('succeeded'))
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      handleServerError(err, dispatch)
    }
  }

export const loginTC = (values: loginValuesType) => async (dispatch: Dispatch<AllActionsType>) => {
  dispatch(appSetStatusAC('loading'))
  try {
    const res = await authAPI.login(values)

    dispatch(appSetStatusAC('succeeded'))
    dispatch(authIsLoggedInAC(true))
    dispatch(authUserAC(res.data))
  } catch (e) {
    const err = e as Error | AxiosError<{ error: string }>

    handleServerError(err, dispatch)
  }
}

export const isAuthLoadingTC = () => async (dispatch: Dispatch<AllActionsType>) => {
  try {
    const res = await authAPI.authMe()

    dispatch(appSetLoadingAC(false))
    dispatch(authIsLoggedInAC(true))
    dispatch(authUserAC(res.data))
  } catch (e) {
    dispatch(appSetLoadingAC(false))
  }
}

export const forgotPasswordTC =
  (values: forgotPasswordValuesType) => async (dispatch: Dispatch<AllActionsType>) => {
    dispatch(appSetStatusAC('loading'))
    try {
      await authAPI.forgotPassword(values)

      dispatch(authCheckEmailRedirectAC(true))
      dispatch(appSetStatusAC('succeeded'))
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      handleServerError(err, dispatch)
    }
  }

export const changePasswordTC =
  (values: changePasswordType) => async (dispatch: Dispatch<AllActionsType>) => {
    dispatch(appSetStatusAC('loading'))
    try {
      await authAPI.changePassword(values)

      dispatch(appSetStatusAC('succeeded'))
      dispatch(authIsPasswordChangedAC(true))
      dispatch(appAlertAC('Password successfully changed', 'success'))
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      handleServerError(err, dispatch)
    }
  }

export const logoutTC = () => async (dispatch: Dispatch<AllActionsType>) => {
  dispatch(appSetStatusAC('loading'))
  try {
    await authAPI.logout()

    dispatch(authIsLoggedInAC(false))
    dispatch(authDeleteUserAC())
    dispatch(appSetStatusAC('succeeded'))
  } catch (e) {
    const err = e as Error | AxiosError<{ error: string }>

    handleServerError(err, dispatch)
  }
}
export const updateUserTC =
  (data: { name?: string; avatar?: string }) => async (dispatch: Dispatch<AllActionsType>) => {
    dispatch(appSetStatusAC('loading'))

    try {
      const res = await authAPI.changeUserProfile(data)

      dispatch(authUserAC(res.data.updatedUser))
      dispatch(appSetStatusAC('succeeded'))
      dispatch(appAlertAC('Name successfully changed', 'success'))
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      handleServerError(err, dispatch)
    }
  }
export const getGuestUserProfileTC = (id: string) => async (dispatch: Dispatch<AllActionsType>) => {
  dispatch(appSetStatusAC('loading'))

  try {
    const res = await authAPI.getUser(id)

    dispatch(setUserProfileAC(res.data.user))
    dispatch(appSetStatusAC('succeeded'))
  } catch (e) {
    const err = e as Error | AxiosError<{ error: string }>

    handleServerError(err, dispatch)
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
  | ReturnType<typeof setUserProfileAC>
