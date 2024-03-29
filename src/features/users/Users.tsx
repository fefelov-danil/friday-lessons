import React, { useEffect, useState } from 'react'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import Pagination from '@mui/material/Pagination'

import { appSetStatusAC } from '../../app/app-reducer'
import { useAppDispatch, useAppSelector, useDebounce } from '../../app/hooks'
import { InputText } from '../../common/inputText/InputText'
import { SelectNumber } from '../../common/select/SelectNumber'

import {
  getUsersThunk,
  setUsersFilters,
  setUsersPage,
  setUsersPageCount,
  setUsersSearchValue,
  setUsersSortValue,
} from './users-reducer'
import s from './Users.module.css'

export const Users = () => {
  const dispatch = useAppDispatch()
  const usersData = useAppSelector(state => state.users)

  useEffect(() => {
    if (!usersData.usersFetched) {
      dispatch(appSetStatusAC('loading'))
      const filtersFromSS = sessionStorage.getItem('users-filters') // SS - SessionStorage

      if (filtersFromSS) {
        const parsedFiltersFromSS = JSON.parse(filtersFromSS)

        dispatch(setUsersFilters(parsedFiltersFromSS))
        dispatch(getUsersThunk(parsedFiltersFromSS))
      } else {
        dispatch(getUsersThunk(usersData.filters))
      }
    }
  }, [])

  const isLoading = 'loading' === useAppSelector(state => state.app.appStatus)
  const filters = usersData.filters

  const [searchLocalVal, setSearchLocalVal] = useState('')
  const searchDebVal = useDebounce(searchLocalVal, 500)

  const pagesAmount = Math.ceil(usersData.usersTotalCount / filters.pageCount)

  useEffect(() => {
    if (usersData.usersFetched) {
      dispatch(appSetStatusAC('loading'))
      dispatch(getUsersThunk(usersData.filters))
    }
  }, [filters.page, filters.pageCount, filters.sort, filters.userName])
  useEffect(() => {
    dispatch(setUsersPage(1))
    dispatch(setUsersSearchValue(searchLocalVal))
  }, [searchDebVal])

  const onPageCountChange = (pageCount: number) => {
    dispatch(setUsersPage(1))
    dispatch(setUsersPageCount(pageCount))
  }
  const onPageChange = (page: number) => {
    dispatch(setUsersPage(page))
  }

  const onSortChangeHandler = (sortParam: string) => {
    dispatch(setUsersPage(1))
    if (filters.sort.substring(1) !== sortParam) {
      dispatch(setUsersSortValue(`0${sortParam}`))
    } else {
      if (filters.sort.split('')[0] === '0') {
        dispatch(setUsersSortValue(`1${sortParam}`))
      } else {
        dispatch(setUsersSortValue(`0${sortParam}`))
      }
    }
  }

  let sortIcon = <ArrowDropUpIcon />

  if (filters.sort && filters.sort.split('')[0] === '0') {
    sortIcon = <ArrowDropDownIcon />
  }

  return (
    <div className="page">
      <div className="pageContainer">
        <h1>Users</h1>

        <InputText
          placeholder="Enter user name"
          value={searchLocalVal}
          onChange={e => !isLoading && setSearchLocalVal(e.currentTarget.value)}
          className={s.username}
        />
        <table className="table">
          <tbody>
            <tr>
              <th>Avatar</th>
              <th>User name</th>
              <th>
                <p
                  className="sort"
                  onClick={() => !isLoading && onSortChangeHandler('publicCardPacksCount')}
                >
                  Card packs
                  {filters.sort.substring(1) === 'publicCardPacksCount' && sortIcon}
                </p>
              </th>
            </tr>
            {usersData.users.map(u => (
              <tr key={u._id} className={isLoading ? 'loading' : ''}>
                <td>
                  <img
                    className={s.avatar}
                    src={
                      u.avatar
                        ? u.avatar
                        : 'https://www.gravatar.com/avatar/ca6f903ac1e11977898f9b0c9b3d5292.jpg?size=240&d=https%3A%2F%2Fwww.artstation.com%2Fassets%2Fdefault_avatar.jpg'
                    }
                    alt="ava"
                  />
                </td>
                <td>{u.name}</td>
                <td>{u.publicCardPacksCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {usersData.noResults && <div className="noResults">No results</div>}

        <div className="pagination">
          <SelectNumber
            value={usersData.filters.pageCount}
            onChange={onPageCountChange}
            options={[10, 20, 30, 50]}
            disabled={false}
            className="select"
          />
          <span>users on page</span>
          {pagesAmount > 1 && (
            <Pagination
              count={pagesAmount}
              page={usersData.filters.page}
              onChange={(e, page) => !isLoading && onPageChange(page)}
              shape="rounded"
            />
          )}
        </div>
      </div>
    </div>
  )
}
