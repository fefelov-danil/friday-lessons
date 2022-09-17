const initialState = {}

export const loginReducer = (
  state: LoginStateType = initialState,
  action: LoginActionsType
): LoginStateType => {
  switch (action.type) {
    default:
      return state
  }
}

// Actions
export const exampleLoginAC = () => ({ type: 'EXAMPLE' } as const)

// Thunks

// Types
type LoginStateType = {}

type LoginActionsType = ReturnType<typeof exampleLoginAC>
