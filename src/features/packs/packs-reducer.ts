import { AxiosError } from 'axios'

import { setDeletedPackAC, setNewDeckCoverAC, setUpdatedPackAC } from '../cards/cards-reducer'

import { packsAPI } from './packs-API'

import { appSetStatusAC } from 'app/app-reducer'
import { handleServerError } from 'utils/error-utils'
import { AppDispatch, RootState } from 'app/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState: PacksStateType = {
  packsFetched: false,
  cardPacks: [],
  blockRequest: false,
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

export const packsSlice = createSlice({
  name: 'packs',
  initialState,
  reducers: {
    setMinMax(state, action) {
      state.filters.min = action.payload.min
      state.filters.max = action.payload.max
    },
    setMinMaxCardsCount(state, action)  {
      state.minCardsCount = action.payload.minCardsCount
      state.maxCardsCount = action.payload.maxCardsCount      
    },
    setMyPacks(state, action) {
      state.filters.myPacks = action.payload
    },
    setPacksFilters(state, action) {
      state.filters = action.payload
    },
    setPacksPage(state, action) {
      state.filters.page = action.payload
    },
    setPacksPageCount(state, action) {
      state.filters.pageCount = action.payload
    },
    setPacksSearchValue(state, action) {
      state.filters.searchValue = action.payload
    },
    setSortPacks(state, action) {
      state.filters.sortPacks = action.payload
    }
  }, 
  extraReducers: builder => {
    builder
      .addCase(getPacksThunk.fulfilled, (state, action) => {
        state.blockRequest = true
        state.packsFetched = true
        state.cardPacks = action.payload.cardPacks
        state.cardPacksTotalCount = action.payload.cardPacksTotalCount
        state.noResults = action.payload.noResults
        state.minCardsCount = action.payload.minCardsCount
        state.maxCardsCount = action.payload.maxCardsCount
      })
      .addCase(addPackThunk.fulfilled, state => {
        state.cardPacksChanged = state.cardPacksChanged + 1
      })
      .addCase(deletePackThunk.fulfilled, (state, action) => {
        if (action.payload) {
          state.cardPacksChanged = state.cardPacksChanged + 1
        }
      })
      .addCase(updatePackThunk.fulfilled, (state, action) => {
        state.cardPacksChanged = state.cardPacksChanged + 1
        state.cardPacks.forEach(p => p._id === action.payload.id ? {...p, name: action.payload.title} : p)
      })
  }
})

export const {
  setMinMax,
  setMinMaxCardsCount,
  setMyPacks,
  setPacksFilters,
  setPacksPage,
  setPacksPageCount,
  setPacksSearchValue,
  setSortPacks,
} = packsSlice.actions
export const packsReducer = packsSlice.reducer

//Thunks

export const getPacksThunk = createAsyncThunk(
  'packs/GET-PACKS',
  async (props: {
    filters: FiltersType,
    packsAreNotInitialized?: boolean,
    setInitialValues?: (min: number, max: number) => void
  }, {dispatch, getState, rejectWithValue}) => {
    try {
      const res = await packsAPI.getPacks(
        `?page=${props.filters.page}&user_id=${props.filters.myPacks}&pageCount=${props.filters.pageCount}&min=${props.filters.min}&max=${props.filters.max}&sortPacks=${props.filters.sortPacks}&packName=${props.filters.searchValue}`
      )

      const state = getState() as RootState

      sessionStorage.setItem('packs-filters', JSON.stringify(props.filters))

      const noResults = res.data.cardPacks.length === 0

      let minCardsCount = state.packs.minCardsCount
      let maxCardsCount = state.packs.maxCardsCount

      if (props.packsAreNotInitialized) {
        if (!!props.setInitialValues) {          
          props.setInitialValues(res.data.minCardsCount, res.data.maxCardsCount)
        }
        sessionStorage.setItem(
          'packs-filters',
          JSON.stringify({ ...props.filters, min: res.data.minCardsCount, max: res.data.maxCardsCount })
        )
        minCardsCount = res.data.minCardsCount
        maxCardsCount = res.data.maxCardsCount
      }

      const currentMinCardsCount = state.packs.minCardsCount
      const currentMaxCardsCount = state.packs.maxCardsCount

      if (
        res.data.minCardsCount !== currentMinCardsCount ||
        res.data.maxCardsCount !== currentMaxCardsCount
      ) {
        if (props.setInitialValues) {
          props.setInitialValues(res.data.minCardsCount, res.data.maxCardsCount)
        }
        minCardsCount = res.data.minCardsCount
        maxCardsCount = res.data.maxCardsCount
        sessionStorage.setItem(
          'packs-filters',
          JSON.stringify({ ...props.filters, min: res.data.minCardsCount, max: res.data.maxCardsCount })
        )
      }
      dispatch(appSetStatusAC('succeeded'))

      return {noResults, minCardsCount, maxCardsCount, cardPacks: res.data.cardPacks, cardPacksTotalCount: res.data.cardPacksTotalCount}
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      dispatch(appSetStatusAC('failed'))
      handleServerError(err, dispatch as AppDispatch)

      return rejectWithValue(e)
    }
  }
)

export const addPackThunk = createAsyncThunk(
  'packs/ADD-PACK',
  async (props: {
    name: string,
    deckCover: string,
    privatePack: boolean
  }, {dispatch}) => {
    try {
      await packsAPI.createPack(props.name, props.deckCover, props.privatePack)

      dispatch(appSetStatusAC('succeeded'))
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      dispatch(appSetStatusAC('failed'))
      handleServerError(err, dispatch as AppDispatch)
    }
  }
)

export const deletePackThunk = createAsyncThunk(
  'packs/DELETE-PACK',
  async (props: {
    id: string,
    fromCards: boolean,
    callBack?: () => void
  }, {dispatch}) => {
    try {
      await packsAPI.deletePack(props.id)

      if (props.fromCards) dispatch(setDeletedPackAC(true))
      props.callBack && props.callBack()
      dispatch(appSetStatusAC('succeeded'))

      return !props.fromCards
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      dispatch(appSetStatusAC('failed'))
      handleServerError(err, dispatch as AppDispatch)
    }
  }
)

export const updatePackThunk = createAsyncThunk(
  'packs/UPDATE-PACK',
  async (props: {
    id: string,
    newTitle: string,
    deckCover: string,
    fromCards: boolean,
    callBack?: (newName: string) => void
  }, {dispatch, rejectWithValue}) => {
    try {
      await packsAPI.changePack(props.id, props.newTitle, props.deckCover)

      if (props.fromCards) dispatch(setUpdatedPackAC(props.newTitle))

      dispatch(setNewDeckCoverAC(props.deckCover))
      props.callBack && props.callBack(props.newTitle)
      dispatch(appSetStatusAC('succeeded'))

      return {id: props.id, title: props.newTitle}
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      dispatch(appSetStatusAC('failed'))
      handleServerError(err, dispatch as AppDispatch)
      
      return rejectWithValue(e)
    }
  }
)

//Types

interface FiltersType {
  page: number;
  pageCount: number;
  myPacks: string;
  min: number;
  max: number;
  sortPacks: string;
  searchValue: string;
}

interface PacksStateType {
  packsFetched: boolean;
  cardPacks: PackType[];
  blockRequest: boolean;
  cardPacksChanged: number;
  noResults: boolean;
  cardPacksTotalCount: number;
  minCardsCount: number;
  maxCardsCount: number;
  filters: FiltersType;
}

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
  deckCover: string
}