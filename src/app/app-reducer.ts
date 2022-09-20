const appInitialState = {
  status: 'idle' as RequestStatusType,
  isAuthLoading: true as boolean,
  appError: null as null | string,
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
    case 'app/SET-ERROR':
      return { ...state, appError: action.appError }
    default:
      return state
  }
}

// actions
export const setAppStatusAC = (status: RequestStatusType) =>
  ({ type: 'app/SET-STATUS', status } as const)
export const setAppAuthLoadingAC = (isAuthLoading: boolean) =>
  ({ type: 'app/SET-AUTH-LOADING', isAuthLoading } as const)
export const setAppErrorAC = (appError: null | string) =>
  ({ type: 'app/SET-ERROR', appError } as const)

// types
type AppStateType = typeof appInitialState
export type AppActionsType =
  | ReturnType<typeof setAppStatusAC>
  | ReturnType<typeof setAppAuthLoadingAC>
  | ReturnType<typeof setAppErrorAC>
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
