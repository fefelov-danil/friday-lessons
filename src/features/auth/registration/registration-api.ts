import axios, {AxiosResponse} from "axios"

export const instanceHeroku = axios.create({
    baseURL: 'https://neko-back.herokuapp.com/2.0',
    withCredentials: true,
})

export const registrationAPI = {
    signUp: (email: string, password: string) =>
        instanceHeroku.post<RegisterDataType, AxiosResponse<RegisterResponseDataType<AddedUser>>>
            ("/auth/register", { email, password }),
}


export type RegisterDataType = {
    email: string
    password: string
}

type RegisterResponseDataType<T = {}> = {
    addedUser: T
}

type AddedUser = {
    id: string
    email: string
    rememberMe: boolean
    isAdmin: boolean
    name: string
    verified: boolean
    publicCardPacksCount: number
    created: string
    updated: string
    __v: number
}