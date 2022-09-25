import { AppThunk } from '../../app/store'

import { packsAPI } from './packs-API'

const packsInitialState = {
  cardPacks: [] as PackType[],
  cardPacksTotalCount: 0,
  filters: {
    page: 1,
    pageCount: 5,
    myPacks: '',
  },
}

export const packsReducer = (
  state: PacksInitialStateType = packsInitialState,
  action: PacksActionsType
): PacksInitialStateType => {
  switch (action.type) {
    case 'packs/SET-PACKS':
      return {
        ...state,
        cardPacks: action.cardPacks,
        cardPacksTotalCount: action.cardPacksTotalCount,
      }
    case 'packs/SET-FILTERS':
      return { ...state, filters: action.filters }
    case 'packs/SET-PAGE':
      return { ...state, filters: { ...state.filters, page: action.page } }
    case 'packs/SET-MY-PACKS':
      return { ...state, filters: { ...state.filters, myPacks: action.myPacks } }
    case 'packs/SET-PAGE-COUNT':
      return { ...state, filters: { ...state.filters, pageCount: action.pageCount } }
    default:
      return state
  }
}

//Actions
export const setPacksAC = (cardPacks: PackType[], cardPacksTotalCount: number) =>
  ({ type: 'packs/SET-PACKS', cardPacks, cardPacksTotalCount } as const)
export const setFiltersAC = (filters: typeof packsInitialState.filters) =>
  ({ type: 'packs/SET-FILTERS', filters } as const)
export const setPageAC = (page: number) => ({ type: 'packs/SET-PAGE', page } as const)
export const setMyPacksAC = (myPacks: string) => ({ type: 'packs/SET-MY-PACKS', myPacks } as const)
export const setPageCountAC = (pageCount: number) =>
  ({ type: 'packs/SET-PAGE-COUNT', pageCount } as const)

//Thunks
export const getPacksTC =
  (filters: typeof packsInitialState.filters): AppThunk =>
  async dispatch => {
    try {
      const res = await packsAPI.getPacks(
        `?page=${filters.page}&user_id=${filters.myPacks}&pageCount=${filters.pageCount}`
      )

      sessionStorage.setItem('filters', JSON.stringify(filters))

      dispatch(setPacksAC(res.data.cardPacks, res.data.cardPacksTotalCount))
    } catch (err) {
      console.log(err)
    }
  }

//Types
export type PackType = {
  _id: string
  user_id: string
  user_name: string
  private: boolean
  name: string
  path: string
  grade: number
  shots: number
  cardsCount: number
  type: string
  rating: number
  created: string
  updated: string
  more_id: string
  __v: number
}
type PacksInitialStateType = typeof packsInitialState
export type PacksActionsType =
  | ReturnType<typeof setPacksAC>
  | ReturnType<typeof setPageAC>
  | ReturnType<typeof setMyPacksAC>
  | ReturnType<typeof setPageCountAC>
  | ReturnType<typeof setFiltersAC>
