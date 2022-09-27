const appInitialState = {
  appStatus: 'idle' as RequestStatusType,
  appIsLoading: true as boolean,
  appAlert: { message: null, type: null } as AppAlertType,
}

export const appReducer = (
  state: AppStateType = appInitialState,
  action: AppActionsType
): AppStateType => {
  switch (action.type) {
    case 'app/SET-STATUS':
      return { ...state, appStatus: action.appStatus }
    case 'app/SET-LOADING':
      return { ...state, appIsLoading: action.appIsLoading }
    case 'app/SET-ALERT':
      return { ...state, appAlert: action.appAlert }
    default:
      return state
  }
}

// actions
export const appSetStatusAC = (appStatus: RequestStatusType) =>
  ({ type: 'app/SET-STATUS', appStatus } as const)
export const appSetLoadingAC = (appIsLoading: boolean) =>
  ({ type: 'app/SET-LOADING', appIsLoading } as const)
export const appAlertAC = (message: string | null, type: AlertType) =>
  ({ type: 'app/SET-ALERT', appAlert: { message, type } as AppAlertType } as const)

// types
type AppStateType = typeof appInitialState
export type AppActionsType =
  | ReturnType<typeof appSetStatusAC>
  | ReturnType<typeof appSetLoadingAC>
  | ReturnType<typeof appAlertAC>
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type AppAlertType = { message: null | string; type: AlertType }
export type AlertType = null | 'error' | 'success'
