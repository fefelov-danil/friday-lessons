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
  // isLoggedIn: false,
  isVerifyLogin: false,
  checkEmailRedirect: false,
  isInitialized: false,
}

export const authReducer = (state = initialState, action: AuthActionsType): AuthStateType => {
  switch (action.type) {
    // case 'login/LOGIN':
    //   return { ...state, isLoggedIn: action.isLoggedIn }
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
    case 'login/IS-INITIALIZED': {
      return { ...state, isInitialized: action.isInitialized }
    }
    // case 'SET-IS-LOGGED-IN': {
    //   return { ...state, isLoggedIn: action.isLoggedIn }
    // }
    // case 'SET-USER': {
    //   return { ...state, user: action.user }
    // }

    default:
      return state
  }
}

// Actions
// export const loginAC = (isLoggedIn: boolean) => ({ type: 'login/LOGIN', isLoggedIn } as const)
export const verifyLoginAC = (isVerifyLogin: boolean) =>
  ({ type: 'login/VERIFY-LOGIN', isVerifyLogin } as const)
export const userAC = (user: UserType) => ({ type: 'login/USER', user } as const)
export const checkEmailRedirectAC = (redirect: boolean) =>
  ({ type: 'login/CHECK-EMAIL-REDIRECT', redirect } as const)
export const changePasswordAC = (forResetPass: changePasswordType) =>
  ({ type: 'login/CHANGE-PASSWORD', forResetPass } as const)
export const setIsInitializedAC = (isInitialized: boolean) =>
  ({
    type: 'login/IS-INITIALIZED',
    isInitialized,
  } as const)
// export const setIsLoggedInAC = (isLoggedIn: boolean) =>
//   ({
//     type: 'SET-IS-LOGGED-IN',
//     isLoggedIn,
//   } as const)
// export const setUserAC = (user: UserType) =>
//   ({
//     type: 'SET-USER',
//     user,
//   } as const)
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
      })
      .catch(err => {
        dispatch(setAppErrorAC(err.message))
        dispatch(setAppStatusAC('failed'))
      })
  }

export const initializeAppTC = () => async (dispatch: Dispatch<AllActionsType>) => {
  dispatch(setAppStatusAC('loading'))
  try {
    const res = await authAPI.me()

    dispatch(setIsInitializedAC(true))
    // dispatch(setIsLoggedInAC(true))
    dispatch(userAC(res.data))
    dispatch(setAppStatusAC('succeeded'))
  } catch (err) {
    dispatch(setIsInitializedAC(true))
    // dispatch(setIsLoggedInAC(false))
    dispatch(setAppStatusAC('failed'))
  }
}

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
  // isLoggedIn: boolean
  isVerifyLogin: boolean
  checkEmailRedirect: boolean
  changePassword?: changePasswordType
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
  // | ReturnType<typeof loginAC>
  | ReturnType<typeof verifyLoginAC>
  | ReturnType<typeof userAC>
  | ReturnType<typeof checkEmailRedirectAC>
  | ReturnType<typeof changePasswordAC>
  | ReturnType<typeof setIsInitializedAC>
  // | ReturnType<typeof setIsLoggedInAC>
  // | ReturnType<typeof setUserAC>
  | ReturnType<typeof deleteUserAC>
