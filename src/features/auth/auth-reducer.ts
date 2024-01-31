import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'

import { appAlertAC, appSetLoadingAC, appSetStatusAC } from 'app/app-reducer'
import { AppDispatch } from 'app/store'
import {
  AnotherUserType,
  authAPI,
  changePasswordType,
  forgotPasswordValuesType,
  loginValuesType,
  registrationValuesType,
} from 'features/auth/auth-API'
import { handleServerError } from 'utils/error-utils'

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

interface AuthStateType {
  isLoggedIn: boolean
  checkEmailRedirect: boolean
  isPasswordChanged: boolean
  isRegistered: boolean
  changePassword: null | changePasswordType
  user: null | UserType
  guestUser: null | AnotherUserType
}

const initialState: AuthStateType = {
  isLoggedIn: false,
  checkEmailRedirect: false,
  isPasswordChanged: false,
  isRegistered: false,
  changePassword: null as null | changePasswordType,
  user: null as null | UserType,
  guestUser: null as null | AnotherUserType,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload
    },
    setCheckEmailRedirect(state, action) {
      state.checkEmailRedirect = action.payload
    },
    setIsRegistered(state, action) {
      state.isRegistered = action.payload
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registrationThunk.fulfilled, state => {
        state.isRegistered = true
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.user = action.payload
        state.isLoggedIn = true
      })
      .addCase(isAuthLoadingThunk.fulfilled, (state, action) => {
        state.isLoggedIn = true
        state.user = action.payload
      })
      .addCase(forgotPasswordThunk.fulfilled, state => {
        state.checkEmailRedirect = true
        state.checkEmailRedirect = true
      })
      .addCase(changePasswordThunk.fulfilled, state => {
        state.isPasswordChanged = true
      })
      .addCase(logoutThunk.fulfilled, state => {
        state.isLoggedIn = false
        state.user = null
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.user = action.payload
      })
      .addCase(getGuestUserProfileThunk.fulfilled, (state, action) => {
        state.guestUser = action.payload
      })
  },
})

export const { setIsLoggedIn, setCheckEmailRedirect, setIsRegistered } = authSlice.actions
export const authReducer = authSlice.reducer

// Thunks
export const registrationThunk = createAsyncThunk(
  'auth/REGISTRATION',
  async (values: registrationValuesType, { dispatch, rejectWithValue }) => {
    dispatch(appSetStatusAC('loading'))
    try {
      await authAPI.registration(values)
      dispatch(appSetStatusAC('succeeded'))

      return
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      handleServerError(err, dispatch as AppDispatch)

      return rejectWithValue(false)
    }
  }
)

export const loginThunk = createAsyncThunk(
  'auth/LOGIN',
  async (values: loginValuesType, { dispatch, rejectWithValue }) => {
    dispatch(appSetStatusAC('loading'))
    try {
      const res = await authAPI.login(values)

      dispatch(appSetStatusAC('succeeded'))

      return res.data
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      handleServerError(err, dispatch as AppDispatch)

      return rejectWithValue(err)
    }
  }
)

export const isAuthLoadingThunk = createAsyncThunk(
  'auth/IS-AUTH-LOADING',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const res = await authAPI.authMe()

      dispatch(appSetLoadingAC(false))

      return res.data
    } catch (e) {
      dispatch(appSetLoadingAC(false))

      return rejectWithValue(e)
    }
  }
)

export const forgotPasswordThunk = createAsyncThunk(
  'auth/FORGOT-PASSWORD',
  async (values: forgotPasswordValuesType, { dispatch }) => {
    dispatch(appSetStatusAC('loading'))
    try {
      await authAPI.forgotPassword(values)

      dispatch(appSetStatusAC('succeeded'))

      return
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      handleServerError(err, dispatch as AppDispatch)
    }
  }
)

export const changePasswordThunk = createAsyncThunk(
  'auth/CHANGE-PASSWORD',
  async (values: changePasswordType, { dispatch }) => {
    dispatch(appSetStatusAC('loading'))
    try {
      await authAPI.changePassword(values)
      dispatch(appSetStatusAC('succeeded'))
      dispatch(appAlertAC({ message: 'Password successfully changed', type: 'success' }))

      return
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      handleServerError(err, dispatch as AppDispatch)
    }
  }
)

export const logoutThunk = createAsyncThunk('auth/LOGOUT', async (_, { dispatch }) => {
  dispatch(appSetStatusAC('loading'))
  try {
    await authAPI.logout()

    dispatch(appSetStatusAC('succeeded'))

    return
  } catch (e) {
    const err = e as Error | AxiosError<{ error: string }>

    handleServerError(err, dispatch as AppDispatch)
  }
})

export const updateUserThunk = createAsyncThunk(
  'auth/UPDATE-USER',
  async (data: { name?: string; avatar?: string }, { dispatch, rejectWithValue }) => {
    dispatch(appSetStatusAC('loading'))

    try {
      const res = await authAPI.changeUserProfile(data)

      dispatch(appSetStatusAC('succeeded'))
      dispatch(appAlertAC({ message: 'Name successfully changed', type: 'success' }))

      return res.data.updatedUser
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      handleServerError(err, dispatch as AppDispatch)

      return rejectWithValue(err)
    }
  }
)

export const getGuestUserProfileThunk = createAsyncThunk(
  'auth/GET-GUEST-PROFILE',
  async (id: string, { dispatch, rejectWithValue }) => {
    dispatch(appSetStatusAC('loading'))

    try {
      const res = await authAPI.getUser(id)

      dispatch(appSetStatusAC('succeeded'))

      return res.data.user
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      handleServerError(err, dispatch as AppDispatch)

      return rejectWithValue(err)
    }
  }
)
