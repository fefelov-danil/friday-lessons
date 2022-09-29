import { AxiosError } from 'axios'

import { setDeletedPackAC } from '../cards/cards-reducer'

import { packsAPI } from './packs-API'

import { appSetStatusAC } from 'app/app-reducer'
import { AppThunk } from 'app/store'
import { handleServerError } from 'utils/error-utils'

const packsInitialState = {
  packsFetched: false,
  cardPacks: [] as PackType[],
  cardPacksChanged: 0,
  noResults: false,
  cardPacksTotalCount: 0,
  minCardsCount: 0,
  maxCardsCount: 10,
  filters: {
    page: 1,
    pageCount: 5,
    myPacks: '',
    min: 0,
    max: 10,
    sortPacks: '',
    searchValue: '',
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
    case 'packs/SET-PACKS-FETCHED':
      return { ...state, packsFetched: action.fetched }
    case 'packs/SET-MIN-MAX-CARDS-COUNT':
      return { ...state, minCardsCount: action.minCC, maxCardsCount: action.maxCC }
    case 'packs/SET-NO-RESULTS':
      return { ...state, noResults: action.noResults }
    case 'packs/SET-CARDS-PACK-CHANGED':
      return { ...state, cardPacksChanged: state.cardPacksChanged + 1 }

    case 'packs/SET-FILTERS':
      return { ...state, filters: action.filters }

    case 'packs/SET-PAGE':
      return { ...state, filters: { ...state.filters, page: action.page } }
    case 'packs/SET-MY-PACKS':
      return { ...state, filters: { ...state.filters, myPacks: action.myPacks } }
    case 'packs/SET-PAGE-COUNT':
      return { ...state, filters: { ...state.filters, pageCount: action.pageCount } }
    case 'packs/SET-MIN-MAX':
      return { ...state, filters: { ...state.filters, min: action.min, max: action.max } }
    case 'packs/SET-SORT-PACKS':
      return { ...state, filters: { ...state.filters, sortPacks: action.sortPacks } }
    case 'packs/SET-SEARCH-VALUE':
      return { ...state, filters: { ...state.filters, searchValue: action.searchValue } }
    default:
      return state
  }
}

//Actions
export const setPacksAC = (cardPacks: PackType[], cardPacksTotalCount: number) =>
  ({ type: 'packs/SET-PACKS', cardPacks, cardPacksTotalCount } as const)
export const setPacksFetchedAC = (fetched: boolean) =>
  ({ type: 'packs/SET-PACKS-FETCHED', fetched } as const)
export const setMinMaxCardsCountAC = (minCC: number, maxCC: number) =>
  ({ type: 'packs/SET-MIN-MAX-CARDS-COUNT', minCC, maxCC } as const)
export const setPacksNoResultsAC = (noResults: boolean) =>
  ({ type: 'packs/SET-NO-RESULTS', noResults } as const)
export const setCardPacksChangedAC = () => ({ type: 'packs/SET-CARDS-PACK-CHANGED' } as const)

export const setPacksFiltersAC = (filters: typeof packsInitialState.filters) =>
  ({ type: 'packs/SET-FILTERS', filters } as const)

export const setPacksPageAC = (page: number) => ({ type: 'packs/SET-PAGE', page } as const)
export const setMyPacksAC = (myPacks: string) => ({ type: 'packs/SET-MY-PACKS', myPacks } as const)
export const setPacksPageCountAC = (pageCount: number) =>
  ({ type: 'packs/SET-PAGE-COUNT', pageCount } as const)
export const setMinMaxAC = (min: number, max: number) =>
  ({ type: 'packs/SET-MIN-MAX', min, max } as const)
export const setSortPacksAC = (sortPacks: string) =>
  ({ type: 'packs/SET-SORT-PACKS', sortPacks } as const)
export const setPacksSearchValueAC = (searchValue: string) =>
  ({ type: 'packs/SET-SEARCH-VALUE', searchValue } as const)

//Thunks
export const fetchPacksTC =
  (setInitialValues: (min: number, max: number, searchValue: string) => void): AppThunk =>
  async dispatch => {
    try {
      const res = await packsAPI.getPacks('')

      const filtersFromSS = sessionStorage.getItem('packs-filters')

      if (filtersFromSS) {
        const parsedFiltersFromSS = JSON.parse(filtersFromSS)

        setInitialValues(
          parsedFiltersFromSS.min,
          parsedFiltersFromSS.max,
          parsedFiltersFromSS.searchValue
        )
        dispatch(setPacksFiltersAC(parsedFiltersFromSS))
      } else {
        setInitialValues(res.data.minCardsCount, res.data.maxCardsCount, '')
        dispatch(setMinMaxAC(res.data.minCardsCount, res.data.maxCardsCount))
      }

      dispatch(setMinMaxCardsCountAC(res.data.minCardsCount, res.data.maxCardsCount))
      dispatch(setPacksFetchedAC(true))
      dispatch(appSetStatusAC('succeeded'))
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      dispatch(appSetStatusAC('failed'))
      handleServerError(err, dispatch)
    }
  }
export const getPacksTC =
  (filters: typeof packsInitialState.filters): AppThunk =>
  async dispatch => {
    try {
      const res = await packsAPI.getPacks(
        `?page=${filters.page}&user_id=${filters.myPacks}&pageCount=${filters.pageCount}&min=${filters.min}&max=${filters.max}&sortPacks=${filters.sortPacks}&packName=${filters.searchValue}`
      )

      if (res.data.cardPacks.length === 0) {
        dispatch(setPacksNoResultsAC(true))
      } else {
        dispatch(setPacksNoResultsAC(false))
      }

      sessionStorage.setItem('packs-filters', JSON.stringify(filters))

      dispatch(setPacksAC(res.data.cardPacks, res.data.cardPacksTotalCount))
      if (res.data.minCardsCount !== 0 && res.data.maxCardsCount !== 0) {
        dispatch(setMinMaxCardsCountAC(res.data.minCardsCount, res.data.maxCardsCount))
      }
      dispatch(appSetStatusAC('succeeded'))
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      dispatch(appSetStatusAC('failed'))
      handleServerError(err, dispatch)
    }
  }
export const addPackTC =
  (name: string, privatePack: boolean): AppThunk =>
  async dispatch => {
    try {
      await packsAPI.createPack(name, '', privatePack)

      dispatch(setCardPacksChangedAC())
      dispatch(appSetStatusAC('succeeded'))
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      dispatch(appSetStatusAC('failed'))
      handleServerError(err, dispatch)
    }
  }
export const deletePackTC =
  (id: string): AppThunk =>
  async dispatch => {
    try {
      await packsAPI.deletePack(id)

      dispatch(setCardPacksChangedAC())
      dispatch(setDeletedPackAC(true))
      dispatch(appSetStatusAC('succeeded'))
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      dispatch(appSetStatusAC('failed'))
      handleServerError(err, dispatch)
    }
  }
export const updatePackTC =
  (id: string): AppThunk =>
  async dispatch => {
    try {
      await packsAPI.changePack(id, 'changed hardcoded name', '', true)

      dispatch(setCardPacksChangedAC())
      dispatch(appSetStatusAC('succeeded'))
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      dispatch(appSetStatusAC('failed'))
      handleServerError(err, dispatch)
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
  | ReturnType<typeof setPacksFetchedAC>
  | ReturnType<typeof setPacksPageAC>
  | ReturnType<typeof setMyPacksAC>
  | ReturnType<typeof setPacksPageCountAC>
  | ReturnType<typeof setPacksFiltersAC>
  | ReturnType<typeof setMinMaxCardsCountAC>
  | ReturnType<typeof setMinMaxAC>
  | ReturnType<typeof setSortPacksAC>
  | ReturnType<typeof setPacksSearchValueAC>
  | ReturnType<typeof setPacksNoResultsAC>
  | ReturnType<typeof setCardPacksChangedAC>
