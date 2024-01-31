import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type AppAlertType = { message: null | string; type: AlertType }
export type AlertType = null | 'error' | 'success'

type AppStateType = {
  appStatus: RequestStatusType
  appIsLoading: boolean
  appAlert: AppAlertType
}

const initialState: AppStateType = {
  appStatus: 'idle',
  appIsLoading: true,
  appAlert: { message: null, type: null },
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    appSetStatusAC(state, action: PayloadAction<RequestStatusType>) {
      state.appStatus = action.payload
    },
    appSetLoadingAC(state, action: PayloadAction<boolean>) {
      state.appIsLoading = action.payload
    },
    appAlertAC(state, action: PayloadAction<AppAlertType>) {
      state.appAlert = action.payload
    },
  },
})

export const { appSetStatusAC, appSetLoadingAC, appAlertAC } = appSlice.actions
export const appReducer = appSlice.reducer
