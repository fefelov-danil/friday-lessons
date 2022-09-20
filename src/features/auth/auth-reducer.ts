const initialState = {}

export const authReducer = (
  state: ExampleStateType = initialState,
  action: AuthActionsType
): ExampleStateType => {
  switch (action.type) {
    default:
      return state
  }
}

// Actions
export const exampleAC = () => ({ type: 'EXAMPLE' } as const)

// Thunks

// Types
type ExampleStateType = {}

export type AuthActionsType = ReturnType<typeof exampleAC>
