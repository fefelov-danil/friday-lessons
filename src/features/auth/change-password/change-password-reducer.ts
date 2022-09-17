const initialState = {}

export const changePasswordReducer = (state: ChangePasswordStateType = initialState, action: ChangePasswordActionsType): ChangePasswordStateType => {
    switch (action.type) {
        default:
            return state
    }
}

// Actions
export const exampleChangePasswordAC = () => ({type: 'EXAMPLE'} as const)

// Thunks

// Types
type ChangePasswordStateType = {}

type ChangePasswordActionsType =
    | ReturnType<typeof exampleChangePasswordAC>