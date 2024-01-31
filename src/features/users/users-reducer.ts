import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'

import { appSetStatusAC } from '../../app/app-reducer'
import { AppDispatch, RootState } from '../../app/store'
import { handleServerError } from '../../utils/error-utils'

import { useGetUsersQuery, userType, usersApi } from './users-API'

interface UsersInitialStateType {
  usersFetched: boolean
  users: userType[]
  usersTotalCount: number
  noResults: boolean
  filters: {
    page: number
    pageCount: number
    sort: string
    userName: string
  }
}

const initialFilters = {
  page: 1,
  pageCount: 10,
  sort: '',
  userName: '',
}

export const getUsersThunk = createAsyncThunk(
  'users/GET-USERS',
  async (filters: typeof initialFilters, { dispatch, rejectWithValue, extra }) => {
    debugger
    console.log(filters);
    

    try {
      const res = await extra(
        `?page=${filters.page}&pageCount=${filters.pageCount}&userName=${filters.userName}&sortUsers=${filters.sort}`
      )

      sessionStorage.setItem('users-filters', JSON.stringify(filters))
      dispatch(appSetStatusAC('succeeded'))

      if (res.data?.users.length === 0) {
        return {
          noResults: true,
          usersTotalCount: res.data.usersTotalCount,
          users: [] as userType[],
        }
      }

      if (res.data) {
        return {
          noResults: false,
          usersTotalCount: res.data.usersTotalCount,
          users: res.data.users,
        }
      }

      return {
        noResults: false,
        usersTotalCount: 0,
        users: [],
      }
    } catch (error) {
      dispatch(appSetStatusAC('failed'))
      const err = error as Error | AxiosError<{ error: string }>

      handleServerError(err, dispatch as AppDispatch)

      return rejectWithValue({ error: 'Failed to get users' })
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    usersFetched: false,
    users: [] as userType[],
    usersTotalCount: 0,
    noResults: false,
    filters: initialFilters,
  } as UsersInitialStateType,
  reducers: {
    setUsersFilters: (state, action) => {
      state.filters = action.payload
    },
    setUsersPage: (state, action) => {
      state.filters.page = action.payload
    },
    setUsersSearchValue: (state, action) => {
      state.filters.userName = action.payload
    },
    setUsersPageCount: (state, action) => {
      state.filters.pageCount = action.payload
    },
    setUsersSortValue: (state, action) => {
      state.filters.sort = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getUsersThunk.fulfilled, (state, action) => {
      state.noResults = action.payload.noResults
      state.usersTotalCount = action.payload.usersTotalCount
      state.users = action.payload.users
      state.usersFetched = true
    })
  },
})

export const {
  setUsersFilters,
  setUsersPage,
  setUsersSearchValue,
  setUsersPageCount,
  setUsersSortValue,
} = usersSlice.actions

export const selectUsers = (state: RootState) => state.users

export const usersReducer = usersSlice.reducer
