import { AxiosError } from 'axios'

import { appSetStatusAC } from '../../app/app-reducer'
import { AppThunk } from '../../app/store'
import { handleServerError } from '../../utils/error-utils'

import { usersAPI, userType } from './users-API'

//Reducer
const UsersInitialState = {
  usersFetched: false,
  users: [] as userType[],
  usersTotalCount: 0,
  noResults: false,
  filters: {
    page: 1,
    pageCount: 10,
    sort: '',
    userName: '',
  },
}

export const usersReducer = (
  state: UsersInitialStateType = UsersInitialState,
  action: UsersActionsType
) => {
  switch (action.type) {
    case 'users/SET-USERS-FETCHED':
      return { ...state, usersFetched: action.usersFetched }
    case 'users/SET-NO-RESULTS':
      return { ...state, noResults: action.noResults }
    case 'users/SET-USERS':
      return { ...state, users: action.users }
    case 'users/SET-USERS-FILTERS':
      return { ...state, filters: action.filters }
    case 'users/SET-USERS-TOTAL-COUNT':
      return { ...state, usersTotalCount: action.usersTotalCount }
    case 'users/SET-USERS-PAGE':
      return { ...state, filters: { ...state.filters, page: action.page } }
    case 'users/SET-USERS-PAGE-COUNT':
      return { ...state, filters: { ...state.filters, pageCount: action.pageCount } }
    case 'users/SET-SEARCH-VALUE':
      return { ...state, filters: { ...state.filters, userName: action.searchValue } }
    case 'users/SET-SORT-VALUE':
      return { ...state, filters: { ...state.filters, sort: action.sort } }

    default:
      return state
  }
}

// Thunks
export const getUsersTC =
  (filters: typeof UsersInitialState.filters): AppThunk =>
  async dispatch => {
    try {
      const res = await usersAPI.getUsers(
        `?page=${filters.page}&pageCount=${filters.pageCount}&userName=${filters.userName}&sortUsers=${filters.sort}`
      )

      if (res.data.users.length === 0) {
        dispatch(setNoResultsAC(true))
      } else {
        dispatch(setNoResultsAC(false))
      }
      sessionStorage.setItem('users-filters', JSON.stringify(filters))
      dispatch(setUsersFetchedAC(true))
      dispatch(setUsersTotalCountAC(res.data.usersTotalCount))
      dispatch(setUsersAC(res.data.users))
      dispatch(appSetStatusAC('succeeded'))
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      dispatch(appSetStatusAC('failed'))
      handleServerError(err, dispatch)
    }
  }

// Actions
export const setUsersFetchedAC = (usersFetched: boolean) =>
  ({ type: 'users/SET-USERS-FETCHED', usersFetched } as const)
export const setNoResultsAC = (noResults: boolean) =>
  ({ type: 'users/SET-NO-RESULTS', noResults } as const)
export const setUsersAC = (users: userType[]) => ({ type: 'users/SET-USERS', users } as const)
export const setUsersFiltersAC = (filters: typeof UsersInitialState.filters) =>
  ({ type: 'users/SET-USERS-FILTERS', filters } as const)
export const setUsersTotalCountAC = (usersTotalCount: number) =>
  ({ type: 'users/SET-USERS-TOTAL-COUNT', usersTotalCount } as const)
export const setUsersPageAC = (page: number) => ({ type: 'users/SET-USERS-PAGE', page } as const)
export const setUsersPageCountAC = (pageCount: number) =>
  ({ type: 'users/SET-USERS-PAGE-COUNT', pageCount } as const)
export const setSearchValueAC = (searchValue: string) =>
  ({ type: 'users/SET-SEARCH-VALUE', searchValue } as const)
export const setUsersSortValueAC = (sort: string) =>
  ({ type: 'users/SET-SORT-VALUE', sort } as const)

// Types
type UsersInitialStateType = typeof UsersInitialState
export type UsersActionsType =
  | ReturnType<typeof setUsersAC>
  | ReturnType<typeof setUsersFiltersAC>
  | ReturnType<typeof setUsersPageAC>
  | ReturnType<typeof setUsersPageCountAC>
  | ReturnType<typeof setSearchValueAC>
  | ReturnType<typeof setUsersSortValueAC>
  | ReturnType<typeof setUsersTotalCountAC>
  | ReturnType<typeof setUsersFetchedAC>
  | ReturnType<typeof setNoResultsAC>
