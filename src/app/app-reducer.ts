const appInitialState = {
  status: 'idle' as RequestStatusType,
  isAuthLoading: true as boolean,
  appAlert: { message: null, type: null } as AppAlertType,
}

export const appReducer = (
  state: AppStateType = appInitialState,
  action: AppActionsType
): AppStateType => {
  switch (action.type) {
    case 'app/SET-STATUS':
      return { ...state, status: action.status }
    case 'app/SET-AUTH-LOADING':
      return { ...state, isAuthLoading: action.isAuthLoading }
    case 'app/SET-ALERT':
      return { ...state, appAlert: action.appAlert }
    default:
      return state
  }
}

// actions
export const setAppStatusAC = (status: RequestStatusType) =>
  ({ type: 'app/SET-STATUS', status } as const)
export const setAppAuthLoadingAC = (isAuthLoading: boolean) =>
  ({ type: 'app/SET-AUTH-LOADING', isAuthLoading } as const)
export const setAppAlertAC = (message: string | null, type: AlertType) =>
  ({ type: 'app/SET-ALERT', appAlert: { message, type } as AppAlertType } as const)

// types
type AppStateType = typeof appInitialState
export type AppActionsType =
  | ReturnType<typeof setAppStatusAC>
  | ReturnType<typeof setAppAuthLoadingAC>
  | ReturnType<typeof setAppAlertAC>
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type AppAlertType = { message: null | string; type: AlertType }
export type AlertType = null | 'error' | 'success'
