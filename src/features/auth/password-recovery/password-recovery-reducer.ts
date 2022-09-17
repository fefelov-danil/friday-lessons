const initialState = {}

export const passwordRecoveryReducer = (
  state: PasswordRecoveryStateType = initialState,
  action: PasswordRecoveryActionsType
): PasswordRecoveryStateType => {
  switch (action.type) {
    default:
      return state
  }
}

// Actions
export const examplePasswordRecoveryAC = () => ({ type: 'EXAMPLE' } as const)

// Thunks

// Types
type PasswordRecoveryStateType = {}

type PasswordRecoveryActionsType = ReturnType<typeof examplePasswordRecoveryAC>
