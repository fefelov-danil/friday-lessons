import { Dispatch } from 'redux'

import { setAppAuthLoadingAC, setAppErrorAC, setAppStatusAC } from 'app/app-reducer'
import { AllActionsType } from 'app/store'
import {
  authAPI,
  changePasswordType,
  forgotPasswordValuesType,
  loginValuesType,
} from 'features/auth/auth-API'

const initialState = {
  isVerifyLogin: false,
  checkEmailRedirect: false,
  isInitialized: false,
  isPasswordChanged: false,
}

export const authReducer = (
  state: AuthStateType = initialState,
  action: AuthActionsType
): AuthStateType => {
  switch (action.type) {
    case 'login/VERIFY-LOGIN':
      return { ...state, isVerifyLogin: action.isVerifyLogin }
    case 'login/USER':
      return { ...state, user: action.user }
    case 'login/DELETE-USER': {
      const stateCopy = { ...state }

      delete stateCopy.user

      return stateCopy
    }
    case 'login/CHECK-EMAIL-REDIRECT':
      return { ...state, checkEmailRedirect: action.redirect }
    case 'login/CHANGE-PASSWORD':
      return { ...state, changePassword: action.forResetPass }
    case 'login/IS-PASSWORD-CHANGED':
      return { ...state, isPasswordChanged: action.isPasswordChanged }

    default:
      return state
  }
}

// Actions
export const verifyLoginAC = (isVerifyLogin: boolean) =>
  ({ type: 'login/VERIFY-LOGIN', isVerifyLogin } as const)
export const userAC = (user: UserType) => ({ type: 'login/USER', user } as const)
export const checkEmailRedirectAC = (redirect: boolean) =>
  ({ type: 'login/CHECK-EMAIL-REDIRECT', redirect } as const)
export const changePasswordAC = (forResetPass: changePasswordType) =>
  ({ type: 'login/CHANGE-PASSWORD', forResetPass } as const)
export const isPasswordChangedAC = (isPasswordChanged: boolean) =>
  ({ type: 'login/IS-PASSWORD-CHANGED', isPasswordChanged } as const)
export const deleteUserAC = () =>
  ({
    type: 'login/DELETE-USER',
  } as const)

// Thunks
export const loginTC = (values: loginValuesType) => (dispatch: Dispatch<AllActionsType>) => {
  dispatch(setAppStatusAC('loading'))
  authAPI
    .login(values)
    .then(res => {
      dispatch(setAppStatusAC('succeeded'))
      // dispatch(loginAC(true))
      dispatch(verifyLoginAC(true))
      // dispatch(setIsLoggedInAC(true))
      dispatch(userAC(res.data))
    })
    .catch(err => {
      dispatch(setAppStatusAC('failed'))
      dispatch(setAppErrorAC(err.message))
      // dispatch(setIsLoggedInAC(false))
    })
}

export const isAuthLoadingTC = () => (dispatch: Dispatch<AllActionsType>) => {
  authAPI
    .authMe()
    .then(res => {
      dispatch(setAppAuthLoadingAC(false))
      dispatch(verifyLoginAC(true))
      dispatch(userAC(res.data))
    })
    .catch(err => {
      dispatch(setAppAuthLoadingAC(false))
      // dispatch(loginAC(false))
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
  (values: changePasswordType) => async (dispatch: Dispatch<AllActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authAPI
      .changePassword(values)
      .then(res => {
        dispatch(setAppStatusAC('succeeded'))
        dispatch(isPasswordChangedAC(true))
      })
      .catch(err => {
        console.log(err)
        dispatch(setAppErrorAC(err.message))
        dispatch(setAppStatusAC('failed'))
      })
  }

// export const initializeAppTC = () => async (dispatch: Dispatch<AllActionsType>) => {
//   dispatch(setAppStatusAC('loading'))
//   try {
//     const res = await authAPI.me()
//
//     dispatch(setIsInitializedAC(true))
//     // dispatch(setIsLoggedInAC(true))
//     dispatch(userAC(res.data))
//     dispatch(setAppStatusAC('succeeded'))
//   } catch (err) {
//     dispatch(setIsInitializedAC(true))
//     // dispatch(setIsLoggedInAC(false))
//     dispatch(setAppStatusAC('failed'))
//   }
// }

export const logoutTC = () => async (dispatch: Dispatch<AllActionsType>) => {
  dispatch(setAppStatusAC('loading'))
  try {
    await authAPI.logout()

    dispatch(verifyLoginAC(false))
    // dispatch(setIsLoggedInAC(false))
    dispatch(deleteUserAC())
    dispatch(setAppStatusAC('succeeded'))
  } catch (err) {
    console.log(err)
    dispatch(setAppStatusAC('failed'))
  }
}
export const changeUsernameTC = (name: string) => async (dispatch: Dispatch<AllActionsType>) => {
  dispatch(setAppStatusAC('loading'))
  try {
    const res = await authAPI.changeUsername(name)

    dispatch(userAC(res.data.updatedUser))
    dispatch(setAppStatusAC('succeeded'))
  } catch (err) {
    console.log(err)
    dispatch(setAppStatusAC('failed'))
  }
}

// Types
export type AuthStateType = {
  isVerifyLogin: boolean
  checkEmailRedirect: boolean
  changePassword?: changePasswordType
  isPasswordChanged: boolean
  user?: UserType
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
  | ReturnType<typeof verifyLoginAC>
  | ReturnType<typeof userAC>
  | ReturnType<typeof checkEmailRedirectAC>
  | ReturnType<typeof changePasswordAC>
  | ReturnType<typeof isPasswordChangedAC>
  | ReturnType<typeof deleteUserAC>
