import { registrationAPI } from './registration-api';

const initialState: RegistrationStateType = {
  isRegistered: false,
  errorMessage: '',
}

export const registrationReducer = (
  state: RegistrationStateType = initialState,
  action: RegistrationActionsType
): RegistrationStateType => {
  switch (action.type) {
    case "SET-IS-REGISTERED":
      return { ...state, isRegistered: action.isRegistered }
    case "ERROR":
      return { ...state, errorMessage: action.errorMessage }
    default:
      return state
  }
}

// Actions
export const setSuccesRegistration = (isRegistered: boolean) => ({ type: "SET-IS-REGISTERED", isRegistered } as const)
export const setErrorMessage = (errorMessage: string) => ({ type: "ERROR", errorMessage } as const)

// Thunks
export const signUpTC = (email: string, password: string) => (dispatch: any) => {
  registrationAPI.signUp(email, password)
    .then(res => {
      dispatch(setSuccesRegistration(true))
    })
    .catch((err) => {
      dispatch(setErrorMessage(err.response.data.error))
     })
    .finally(() => { })
}

// Types
type RegistrationStateType = {
  isRegistered: boolean
  errorMessage: string
}

type RegistrationActionsType = ReturnType<typeof setSuccesRegistration> | ReturnType<typeof setErrorMessage>
