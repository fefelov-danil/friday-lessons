import { AxiosError } from 'axios'

import { appSetStatusAC } from '../../app/app-reducer'
import { AppThunk } from '../../app/store'
import { handleServerError } from '../../utils/error-utils'

import { cardsAPI } from './cards-API'

const cardsInitialState = {
  creatorId: '',
  cardsFetched: false,
  noResults: false,
  cards: [] as CardType[],
  cardsTotalCount: 0,
  cardsChanged: 0,
  deletedPack: false,
  updatedPack: '',
  filters: {
    page: 1,
    pageCount: 10,
    searchValue: '',
    sortCards: '',
  },
}

export const cardsReducer = (
  state: CardsStateType = cardsInitialState,
  action: CardsActionsType
) => {
  switch (action.type) {
    case 'cards/SET-CREATOR-ID':
      return { ...state, creatorId: action.id }
    case 'cards/SET-CARDS':
      return { ...state, cards: [...action.cards] }
    case 'cards/SET-CARDS-TOTAL-COUNT':
      return { ...state, cardsTotalCount: action.cardsTotalCount }
    case 'cards/SET-CARDS-FETCHED':
      return { ...state, cardsFetched: action.cardsFetched }
    case 'cards/SET-NO-RESULTS':
      return { ...state, noResults: action.noResults }
    case 'cards/SET-CARDS-CHANGED':
      return { ...state, cardsChanged: state.cardsChanged + 1 }
    case 'cars/SET-DELETED-PACK':
      return { ...state, deletedPack: action.deletedPack }
    case 'cards/SET-UPDATED-PACK':
      return { ...state, updatedPack: action.newTitle }

    case 'cards/SET-FILTERS':
      return { ...state, filters: action.filters }

    case 'cards/SET-PAGE':
      return { ...state, filters: { ...state.filters, page: action.page } }
    case 'cards/SET-PAGE-COUNT':
      return { ...state, filters: { ...state.filters, pageCount: action.pageCount } }
    case 'cards/SET-SEARCH-VALUE':
      return { ...state, filters: { ...state.filters, searchValue: action.searchValue } }
    case 'cards/SET-SORT-CARDS':
      return { ...state, filters: { ...state.filters, sortCards: action.sortCards } }
    case 'cards/SET-CARD-GRADE':
      return {
        ...state,
        cards: state.cards.map(card =>
          card._id === action.card_id ? { ...card, grade: action.grade, shots: action.shots } : card
        ),
      }
    default:
      return state
  }
}

//Actions
export const setCreatorIdAC = (id: string) => ({ type: 'cards/SET-CREATOR-ID', id } as const)
export const setCardsAC = (cards: CardType[]) => ({ type: 'cards/SET-CARDS', cards } as const)
export const setCardsTotalCountAC = (cardsTotalCount: number) =>
  ({ type: 'cards/SET-CARDS-TOTAL-COUNT', cardsTotalCount } as const)
export const setCardsFetchedAC = (cardsFetched: boolean) =>
  ({ type: 'cards/SET-CARDS-FETCHED', cardsFetched } as const)
export const setCardsNoResultsAC = (noResults: boolean) =>
  ({ type: 'cards/SET-NO-RESULTS', noResults } as const)
export const setCardsChangedAC = () => ({ type: 'cards/SET-CARDS-CHANGED' } as const)
export const setDeletedPackAC = (deletedPack: boolean) =>
  ({ type: 'cars/SET-DELETED-PACK', deletedPack } as const)
export const setUpadtedPackAC = (newTitle: string) =>
  ({ type: 'cards/SET-UPDATED-PACK', newTitle } as const)

export const setCardsFiltersAC = (filters: typeof cardsInitialState.filters) =>
  ({ type: 'cards/SET-FILTERS', filters } as const)

export const setCardsPageAC = (page: number) => ({ type: 'cards/SET-PAGE', page } as const)
export const setCardsPageCountAC = (pageCount: number) =>
  ({ type: 'cards/SET-PAGE-COUNT', pageCount } as const)
export const setCardsSearchValueAC = (searchValue: string) =>
  ({ type: 'cards/SET-SEARCH-VALUE', searchValue } as const)
export const setSortCardsAC = (sortCards: string) =>
  ({ type: 'cards/SET-SORT-CARDS', sortCards } as const)
export const updateCardGradeAC = (card_id: string, grade: number, shots: number) =>
  ({
    type: 'cards/SET-CARD-GRADE',
    card_id,
    grade,
    shots,
  } as const)

//Thunks
export const getCardsTC =
  (packId: string, filters: typeof cardsInitialState.filters): AppThunk =>
  async dispatch => {
    try {
      const res = await cardsAPI.getCards(
        `cardsPack_id=${packId}&page=${filters.page}&pageCount=${filters.pageCount}&cardQuestion=${filters.searchValue}&sortCards=${filters.sortCards}`
      )

      sessionStorage.setItem('cards-filters', JSON.stringify(filters))
      if (res.data.cards.length === 0) {
        dispatch(setCardsNoResultsAC(true))
      } else {
        dispatch(setCardsNoResultsAC(false))
      }
      dispatch(setCreatorIdAC(res.data.packUserId))
      dispatch(setCardsAC(res.data.cards))
      dispatch(setCardsTotalCountAC(res.data.cardsTotalCount))
      dispatch(setCardsFetchedAC(true))
      dispatch(appSetStatusAC('succeeded'))
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      dispatch(appSetStatusAC('failed'))
      handleServerError(err, dispatch)
    }
  }
export const addCardTC =
  (packId: string, question: string, answer: string): AppThunk =>
  async dispatch => {
    try {
      await cardsAPI.addCard(packId, question, answer)

      dispatch(setCardsChangedAC())
      dispatch(appSetStatusAC('succeeded'))
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      dispatch(appSetStatusAC('failed'))
      handleServerError(err, dispatch)
    }
  }
export const updateCardTC =
  (cardId: string, question: string, answer: string): AppThunk =>
  async dispatch => {
    try {
      await cardsAPI.updateCard(cardId, question, answer)

      dispatch(setCardsChangedAC())
      dispatch(appSetStatusAC('succeeded'))
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      dispatch(appSetStatusAC('failed'))
      handleServerError(err, dispatch)
    }
  }
export const deleteCardTC =
  (cardId: string): AppThunk =>
  async dispatch => {
    try {
      await cardsAPI.deleteCard(cardId)

      dispatch(setCardsChangedAC())
      dispatch(appSetStatusAC('succeeded'))
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      dispatch(appSetStatusAC('failed'))
      handleServerError(err, dispatch)
    }
  }
export const updateCardGradeTC =
  (grade: number, cardId: string): AppThunk =>
  async dispatch => {
    try {
      const res = await cardsAPI.updateCardGrade(grade, cardId)

      dispatch(
        updateCardGradeAC(
          res.data.updatedGrade.card_id,
          res.data.updatedGrade.grade,
          res.data.updatedGrade.shots
        )
      )
      dispatch(setCardsChangedAC())
      dispatch(appSetStatusAC('succeeded'))
    } catch (e) {
      const err = e as Error | AxiosError<{ error: string }>

      dispatch(appSetStatusAC('failed'))
      handleServerError(err, dispatch)
    }
  }

//Types
type CardsStateType = typeof cardsInitialState
export type CardType = {
  answer: string
  question: string
  cardsPack_id: string
  grade: number
  shots: number
  user_id: string
  created: string
  updated: string
  _id: string
}
export type CardsActionsType =
  | ReturnType<typeof setCreatorIdAC>
  | ReturnType<typeof setCardsAC>
  | ReturnType<typeof setCardsPageAC>
  | ReturnType<typeof setCardsFiltersAC>
  | ReturnType<typeof setCardsTotalCountAC>
  | ReturnType<typeof setCardsFetchedAC>
  | ReturnType<typeof setCardsSearchValueAC>
  | ReturnType<typeof setSortCardsAC>
  | ReturnType<typeof setCardsPageCountAC>
  | ReturnType<typeof setCardsNoResultsAC>
  | ReturnType<typeof setCardsChangedAC>
  | ReturnType<typeof setDeletedPackAC>
  | ReturnType<typeof setUpadtedPackAC>
  | ReturnType<typeof updateCardGradeAC>
