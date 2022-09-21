import { authAPI } from './auth-API'

const initialState = {
  isRegistered: false,
  errorMessage: '',
}

export const authReducer = (
  state: ExampleStateType = initialState,
  action: AuthActionsType
): ExampleStateType => {
  switch (action.type) {
    case 'SET-IS-REGISTERED':
      return { ...state, isRegistered: action.isRegistered }
    case 'ERROR':
      return { ...state, errorMessage: action.errorMessage }
    default:
      return state
  }
}

// Actions
export const setSuccesRegistration = (isRegistered: boolean) =>
  ({ type: 'SET-IS-REGISTERED', isRegistered } as const)
export const setErrorMessage = (errorMessage: string) => ({ type: 'ERROR', errorMessage } as const)

// Thunks
export const signUpTC = (email: string, password: string) => (dispatch: any) => {
  authAPI
    .signUp(email, password)
    .then(res => {
      dispatch(setSuccesRegistration(true))
    })
    .catch(err => {
      dispatch(setErrorMessage(err.response.data.error))
    })
    .finally(() => {})
}

// Types
type ExampleStateType = {
  isRegistered: boolean
  errorMessage: string
}

export type AuthActionsType =
  | ReturnType<typeof setSuccesRegistration>
  | ReturnType<typeof setErrorMessage>
