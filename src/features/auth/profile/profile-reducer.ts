const initialState = {}

export const profileReducer = (state: ProfileStateType = initialState, action: ProfileActionsType): ProfileStateType => {
    switch (action.type) {
        default:
            return state
    }
}

// Actions
export const exampleProfileAC = () => ({type: 'EXAMPLE'} as const)

// Thunks

// Types
type ProfileStateType = {}

type ProfileActionsType =
    | ReturnType<typeof exampleProfileAC>