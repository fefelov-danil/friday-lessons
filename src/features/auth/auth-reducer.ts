import { Dispatch } from 'redux'

import { AllActionsType } from '../../app/store'

import { authAPI } from './auth-API'

const initialState = {
  isLoggedIn: true,
  isInitialized: false,
}

export const authReducer = (
  state: AuthStateType = initialState,
  action: AuthActionsType
): AuthStateType => {
  switch (action.type) {
    case 'SET-IS-INITIALIZED': {
      return { ...state, isInitialized: action.isInitialized }
    }
    case 'SET-IS-LOGGED-IN': {
      return { ...state, isLoggedIn: action.isLoggedIn }
    }
    case 'SET-USER': {
      return { ...state, user: action.user }
    }
    case 'DELETE-USER': {
      const stateCopy = { ...state }

      delete stateCopy.user

      return stateCopy
    }
    default:
      return state
  }
}

// Actions
export const setIsInitializedAC = (isInitialized: boolean) =>
  ({
    type: 'SET-IS-INITIALIZED',
    isInitialized,
  } as const)
export const setIsLoggedInAC = (isLoggedIn: boolean) =>
  ({
    type: 'SET-IS-LOGGED-IN',
    isLoggedIn,
  } as const)
export const setUserAC = (user: UserType) =>
  ({
    type: 'SET-USER',
    user,
  } as const)
export const deleteUserAC = () =>
  ({
    type: 'DELETE-USER',
  } as const)

// Thunks
export const initializeAppTC = () => async (dispatch: Dispatch<AllActionsType>) => {
  try {
    const res = await authAPI.me()

    dispatch(setIsInitializedAC(true))
    dispatch(setIsLoggedInAC(true))
    dispatch(setUserAC(res.data))
  } catch (err) {
    dispatch(setIsInitializedAC(true))
    dispatch(setIsLoggedInAC(false))
  }
}
export const loginTC = () => async (dispatch: Dispatch<AllActionsType>) => {
  try {
    const res = await authAPI.login()

    dispatch(setIsLoggedInAC(true))
    dispatch(setUserAC(res.data))
  } catch (err) {
    dispatch(setIsLoggedInAC(false))
  }
}
export const logoutTC = () => async (dispatch: Dispatch<AllActionsType>) => {
  try {
    await authAPI.logout()

    dispatch(setIsLoggedInAC(false))
    dispatch(deleteUserAC())
  } catch (err) {
    console.log(err)
  }
}
export const changeUsernameTC = (name: string) => async (dispatch: Dispatch<AllActionsType>) => {
  try {
    const res = await authAPI.changeUsername(name)

    dispatch(setUserAC(res.data.updatedUser))
  } catch (err) {
    console.log(err)
  }
}

// Types
export type AuthStateType = {
  user?: UserType
  isLoggedIn: boolean
  isInitialized: boolean
}
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
  | ReturnType<typeof setIsInitializedAC>
  | ReturnType<typeof setIsLoggedInAC>
  | ReturnType<typeof setUserAC>
  | ReturnType<typeof deleteUserAC>
