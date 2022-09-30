import axios from 'axios'

import { CardType } from './cards-reducer'

export const instance = axios.create({
  baseURL: 'https://neko-back.herokuapp.com/2.0/cards/card',
  withCredentials: true,
})

export const cardsAPI = {
  getCards(payload: string) {
    return instance.get<GetCardsResponceType>(`?${payload}`)
  },
  addCard(packId: string, question: string, answer: string) {
    return instance.post('', { card: { cardsPack_id: packId, question, answer } })
  },
  updateCard(cardId: string, question: string, answer: string) {
    return instance.put('', { card: { _id: cardId, question, answer } })
  },
  deleteCard(cardId: string) {
    return instance.delete(`?id=${cardId}`)
  },
}

type GetCardsResponceType = {
  cards: CardType[]
  cardsTotalCount: number
  maxGrade: number
  minGrade: number
  page: number
  pageCount: number
  packUserId: string
}