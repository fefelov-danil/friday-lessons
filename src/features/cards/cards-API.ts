import axios from 'axios'

import { CardType } from './cards-reducer'

export const instance = axios.create({
  baseURL: 'https://neko-back.herokuapp.com/2.0/cards',
  withCredentials: true,
})

export const cardsAPI = {
  getCards(payload: string) {
    return instance.get<GetCardsResponceType>(`/card?${payload}`)
  },
  addCard(
    packId: string,
    question: string,
    answer: string,
    questionImg: string,
    answerImg: string
  ) {
    return instance.post('/card', {
      card: { cardsPack_id: packId, question, answer, questionImg, answerImg },
    })
  },
  updateCard(
    cardId: string,
    question: string,
    answer: string,
    questionImg: string,
    answerImg: string
  ) {
    return instance.put('/card', {
      card: { _id: cardId, question, answer, questionImg, answerImg },
    })
  },
  deleteCard(cardId: string) {
    return instance.delete(`/card?id=${cardId}`)
  },
  updateCardGrade(grade: number, cardId: string) {
    return instance.put(`/grade`, { grade, card_id: cardId })
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
