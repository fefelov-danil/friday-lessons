const initialState = {}

export const registrationReducer = (
  state: RegistrationStateType = initialState,
  action: RegistrationActionsType
): RegistrationStateType => {
  switch (action.type) {
    default:
      return state
  }
}

// Actions
export const exampleRegistrationAC = () => ({ type: 'EXAMPLE' } as const)

// Thunks

// Types
type RegistrationStateType = {}

type RegistrationActionsType = ReturnType<typeof exampleRegistrationAC>
