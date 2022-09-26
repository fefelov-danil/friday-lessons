import axios from 'axios'

import { PackType } from './packs-reducer'

export const instance = axios.create({
  baseURL: 'https://neko-back.herokuapp.com/2.0/cards/pack',
  withCredentials: true,
})

export const packsAPI = {
  getPacks(payload: string) {
    return instance.get<GetPacksResponseType>(payload)
  },
  createPack(name: string, deckCover: string, privatePack: boolean) {
    return instance.post('', { cardsPack: { name, deckCover, private: privatePack } })
  },
  deletePack(id: string) {
    return instance.delete(`?id=${id}`)
  },
  changePack(_id: string, name: string, deckCover: string, privatePack: boolean) {
    return instance.put('', { cardsPack: { _id, name, deckCover, private: privatePack } })
  },
}

type GetPacksResponseType = {
  cardPacks: PackType[]
  cardPacksTotalCount: number
  maxCardsCount: number
  minCardsCount: number
  page: number
  pageCount: number
}
