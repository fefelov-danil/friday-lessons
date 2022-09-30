import React, { useEffect, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff'
import SchoolIcon from '@mui/icons-material/School'
import Pagination from '@mui/material/Pagination'
import { NavLink } from 'react-router-dom'

import { parseDate } from '../../utils/parse-date-util'

import {
  addPackTC,
  deletePackTC,
  fetchPacksTC,
  getPacksTC,
  setPacksFiltersAC,
  setMinMaxAC,
  setMyPacksAC,
  setPacksSearchValueAC,
  setPacksAC,
  setPacksPageAC,
  setPacksPageCountAC,
  setSortPacksAC,
  updatePackTC,
} from './packs-reducer'
import s from './Packs.module.css'

import { appSetStatusAC } from 'app/app-reducer'
import { useAppDispatch, useAppSelector, useDebounce } from 'app/hooks'
import { Button } from 'common/button/Button'
import { DoubleRangeSlider } from 'common/DoubleRangeSlider/DoubleRangeSlider'
import { InputText } from 'common/inputText/InputText'
import { SelectNumber } from 'common/select/SelectNumber'
import { ToggleSwitch } from 'common/toggleSwitch/ToggleSwitch'

export const Packs = () => {
  const dispatch = useAppDispatch()
  const userId = useAppSelector(state => state.auth.user?._id)
  const isLoading = 'loading' === useAppSelector(state => state.app.appStatus)
  const packsData = useAppSelector(state => state.packs)
  const filters = packsData.filters

  const pagesAmount = Math.ceil(packsData.cardPacksTotalCount / filters.pageCount)

  const [searchLocalVal, setSearchLocalVal] = useState('')
  const searchDebVal = useDebounce(searchLocalVal, 500)

  const [minLocalVal, setMinLocalVal] = useState(filters.min)
  const [maxLocalVal, setMaxLocalVal] = useState(filters.max)
  const minDebVal = useDebounce(minLocalVal, 500)
  const maxDebVal = useDebounce(maxLocalVal, 500)

  const setInitialValues = (min: number, max: number, searchValue: string) => {
    setMinLocalVal(min)
    setMaxLocalVal(max)
    setSearchLocalVal(searchValue)
  }

  useEffect(() => {
    dispatch(appSetStatusAC('loading'))
    dispatch(fetchPacksTC(setInitialValues))
  }, [])
  useEffect(() => {
    if (packsData.packsFetched) {
      dispatch(setPacksAC([], packsData.cardPacksTotalCount))
      dispatch(appSetStatusAC('loading'))
      dispatch(getPacksTC(packsData.filters))
    }
  }, [
    packsData.packsFetched,
    packsData.cardPacksChanged,
    filters.page,
    filters.myPacks,
    filters.pageCount,
    filters.min,
    filters.max,
    filters.sortPacks,
    filters.searchValue,
  ])
  useEffect(() => {
    dispatch(setPacksPageAC(1))
    dispatch(setMinMaxAC(minLocalVal, filters.max))
  }, [minDebVal])
  useEffect(() => {
    dispatch(setPacksPageAC(1))
    dispatch(setMinMaxAC(filters.min, maxLocalVal))
  }, [maxDebVal])
  useEffect(() => {
    dispatch(setPacksPageAC(1))
    dispatch(setPacksSearchValueAC(searchLocalVal))
  }, [searchDebVal])

  const onAddPackHandler = () => {
    dispatch(appSetStatusAC('loading'))
    dispatch(addPackTC('new hardcoded pack', true))
  }
  const onDeletePackHandler = (id: string) => {
    dispatch(appSetStatusAC('loading'))
    dispatch(deletePackTC(id))
  }
  const onUpdatePackHandler = (id: string) => {
    dispatch(appSetStatusAC('loading'))
    dispatch(updatePackTC(id))
  }
  const onPageChange = (page: number) => {
    dispatch(setPacksPageAC(page))
  }
  const onMyPacksChange = (myPacks: boolean) => {
    dispatch(setPacksPageAC(1))
    dispatch(setMyPacksAC(myPacks ? `${userId}` : ''))
  }
  const onPageCountChange = (pageCount: number) => {
    dispatch(setPacksPageAC(1))
    dispatch(setPacksPageCountAC(pageCount))
  }
  const onSortChangeHandler = (sortParam: string) => {
    dispatch(setPacksPageAC(1))
    if (filters.sortPacks.substring(1) !== sortParam) {
      dispatch(setSortPacksAC(`0${sortParam}`))
    } else {
      if (filters.sortPacks.split('')[0] === '0') {
        dispatch(setSortPacksAC(`1${sortParam}`))
      } else {
        dispatch(setSortPacksAC(`0${sortParam}`))
      }
    }
  }
  const onDeleteFiltersHandler = () => {
    const newFilters = {
      page: 1,
      pageCount: filters.pageCount,
      myPacks: filters.myPacks,
      min: packsData.minCardsCount,
      max: packsData.maxCardsCount,
      sortPacks: '',
      searchValue: '',
    }

    setInitialValues(packsData.minCardsCount, packsData.maxCardsCount, '')
    dispatch(setPacksFiltersAC(newFilters))
  }

  let sortIcon = <ArrowDropUpIcon />

  if (filters.sortPacks && filters.sortPacks.split('')[0] === '0') {
    sortIcon = <ArrowDropDownIcon />
  }

  return (
    <div className={s.packsPage}>
      <div className={s.packsContainer}>
        <div className={s.packsList}>
          <h1>Packs List</h1>
          <Button style={{ display: 'flex' }} disabled={isLoading} onClick={onAddPackHandler}>
            <AddIcon /> Add new pack
          </Button>
        </div>

        <div className={s.filters}>
          <InputText
            placeholder="Enter pack name"
            value={searchLocalVal}
            onChange={e => !isLoading && setSearchLocalVal(e.currentTarget.value)}
          />
          <div className={s.allOrMyPacks}>
            Packs:
            <ToggleSwitch
              param1={'all'}
              param2={'my'}
              selected={!!packsData.filters.myPacks}
              onChange={onMyPacksChange}
              disabled={isLoading}
            />
          </div>

          <DoubleRangeSlider
            min={packsData.minCardsCount}
            max={packsData.maxCardsCount}
            minVal={minLocalVal}
            maxVal={maxLocalVal}
            setMinVal={(min: number) => !isLoading && setMinLocalVal(min)}
            setMaxVal={(max: number) => !isLoading && setMaxLocalVal(max)}
          />

          <Button
            style={{ display: 'flex' }}
            disabled={isLoading}
            onClick={() => onDeleteFiltersHandler()}
          >
            <FilterAltOffIcon />
          </Button>
        </div>
        <table className={s.packsTable}>
          <tbody>
            <tr>
              <th>Pack name</th>
              <th>
                <p
                  className={s.sort}
                  onClick={() => !isLoading && onSortChangeHandler('cardsCount')}
                >
                  Cards
                  {filters.sortPacks.substring(1) === 'cardsCount' && sortIcon}
                </p>
              </th>
              <th>
                <p className={s.sort} onClick={() => !isLoading && onSortChangeHandler('updated')}>
                  Updated
                  {filters.sortPacks.substring(1) === 'updated' && sortIcon}
                </p>
              </th>
              <th>Creator</th>
              <th>Actions</th>
            </tr>
            {packsData.cardPacks.map(p => (
              <tr key={p._id}>
                <td>
                  <NavLink to={`${p._id}/${p.name}`}>{p.name}</NavLink>
                </td>
                <td>{p.cardsCount}</td>
                <td>{parseDate(p.updated)}</td>
                <td>{p.user_name}</td>
                <td>
                  <div className={s.actionsContainer}>
                    <SchoolIcon className={s.action} />
                    {p.user_id === userId && (
                      <>
                        <EditIcon
                          className={s.action}
                          onClick={() => !isLoading && onUpdatePackHandler(p._id)}
                        />
                        <DeleteIcon
                          className={s.action}
                          onClick={() => !isLoading && onDeletePackHandler(p._id)}
                        />
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {packsData.noResults && <div className={s.noResults}>No results, try other filters</div>}
        <div className={s.pagination}>
          <SelectNumber
            value={packsData.filters.pageCount}
            onChange={onPageCountChange}
            options={[5, 10, 25, 50]}
            disabled={isLoading}
            className={s.select}
          />
          <span>packs on page</span>
          {pagesAmount > 1 && (
            <Pagination
              count={pagesAmount}
              page={packsData.filters.page}
              onChange={(e, page) => !isLoading && onPageChange(page)}
              shape="rounded"
            />
          )}
        </div>
      </div>
    </div>
  )
}