import React, { useEffect, useState } from 'react'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import Pagination from '@mui/material/Pagination'

import { appSetStatusAC } from '../../../app/app-reducer'
import { useAppDispatch, useAppSelector, useDebounce } from '../../../app/hooks'
import { Button } from '../../../common/button/Button'
import { Checkbox } from '../../../common/checkbox/Checkbox'
import { DoubleRangeSlider } from '../../../common/DoubleRangeSlider/DoubleRangeSlider'
import { InputText } from '../../../common/inputText/InputText'
import { SelectNumber } from '../../../common/select/SelectNumber'
import {
  addPackTC,
  deletePackTC,
  fetchPacksTC,
  getPacksTC,
  setFiltersAC,
  setMinMaxAC,
  setMyPacksAC,
  setPackNameAC,
  setPacksAC,
  setPageAC,
  setPageCountAC,
  setSortPacksAC,
  updatePackTC,
} from '../packs-reducer'

import s from './Packs.module.css'

export const Packs = () => {
  const dispatch = useAppDispatch()
  const userId = useAppSelector(state => state.auth.user?._id)
  const isLoading = useAppSelector(state => state.app.appStatus) === 'loading'
  const PacksData = useAppSelector(state => state.packs)
  const filters = PacksData.filters

  const pagesAmount = Math.round(PacksData.cardPacksTotalCount / filters.pageCount)

  const [searchValue, setSearchValue] = useState('')
  const searchDebValue = useDebounce(searchValue, 500)

  const [minLocalVal, setMinLocalVal] = useState(filters.min)
  const [maxLocalVal, setMaxLocalVal] = useState(filters.max)
  const minDebVal = useDebounce(minLocalVal, 500)
  const maxDebVal = useDebounce(maxLocalVal, 500)

  const setInitialValues = (min: number, max: number, searchValue: string) => {
    setMinLocalVal(min)
    setMaxLocalVal(max)
    setSearchValue(searchValue)
  }

  useEffect(() => {
    if (!PacksData.packsFetched) {
      dispatch(appSetStatusAC('loading'))
      dispatch(fetchPacksTC(setInitialValues))
    }
  }, [])
  useEffect(() => {
    if (PacksData.packsFetched) {
      dispatch(setPacksAC([], PacksData.cardPacksTotalCount))
      dispatch(appSetStatusAC('loading'))
      dispatch(getPacksTC(PacksData.filters, setInitialValues))
    }
  }, [
    PacksData.packsFetched,
    PacksData.cardPacksChanged,
    filters.page,
    filters.myPacks,
    filters.pageCount,
    filters.min,
    filters.max,
    filters.sortPacks,
    filters.packName,
  ])
  useEffect(() => {
    dispatch(setPageAC(1))
    dispatch(setMinMaxAC(minLocalVal, filters.max))
  }, [minDebVal])
  useEffect(() => {
    dispatch(setPageAC(1))
    dispatch(setMinMaxAC(filters.min, maxLocalVal))
  }, [maxDebVal])
  useEffect(() => {
    dispatch(setPageAC(1))
    dispatch(setPackNameAC(searchValue))
  }, [searchDebValue])

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
    dispatch(setPageAC(page))
  }
  const onMyPacksChange = (myPacks: boolean) => {
    dispatch(setPageAC(1))
    dispatch(setMyPacksAC(myPacks ? `${userId}` : ''))
  }
  const onPageCountChange = (pageCount: number) => {
    dispatch(setPageAC(1))
    dispatch(setPageCountAC(pageCount))
  }
  const onSortChangeHandler = (sortParam: string) => {
    dispatch(setPageAC(1))
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
      min: PacksData.minCardsCount,
      max: PacksData.maxCardsCount,
      sortPacks: '',
      packName: '',
    }

    setInitialValues(PacksData.minCardsCount, PacksData.maxCardsCount, '')
    dispatch(setFiltersAC(newFilters))
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
          <Button disabled={isLoading} onClick={onAddPackHandler}>
            Add pack
          </Button>
        </div>

        <div className={s.filters}>
          <InputText
            value={searchValue}
            onChange={e => !isLoading && setSearchValue(e.currentTarget.value)}
          />
          <Checkbox
            checked={!!PacksData.filters.myPacks}
            onChange={e => !isLoading && onMyPacksChange(e.currentTarget.checked)}
          >
            Only my packs
          </Checkbox>
          <DoubleRangeSlider
            min={PacksData.minCardsCount}
            max={PacksData.maxCardsCount}
            minVal={minLocalVal}
            maxVal={maxLocalVal}
            setMinVal={(min: number) => !isLoading && setMinLocalVal(min)}
            setMaxVal={(max: number) => !isLoading && setMaxLocalVal(max)}
          />
          <Button disabled={isLoading} onClick={onDeleteFiltersHandler}>
            Delete filters
          </Button>
        </div>
        <p onClick={() => !isLoading && onSortChangeHandler('updated')}>
          updated{' '}
          {(filters.sortPacks === '0updated' || filters.sortPacks === '1updated') && sortIcon}
        </p>
        <p onClick={() => !isLoading && onSortChangeHandler('cardsCount')}>
          cards count{' '}
          {(filters.sortPacks === '0cardsCount' || filters.sortPacks === '1cardsCount') && sortIcon}
        </p>
        {PacksData.noResults ? (
          <div>No results. Try other filters</div>
        ) : (
          PacksData.cardPacks.map(p => (
            <div key={p._id}>
              Name: {p.name} <br />
              Cards count:{p.cardsCount}
              {p.user_id === userId && (
                <>
                  <Button disabled={isLoading} onClick={() => onDeletePackHandler(p._id)}>
                    Delete Pack
                  </Button>
                  <Button disabled={isLoading} onClick={() => onUpdatePackHandler(p._id)}>
                    Update Pack
                  </Button>
                </>
              )}
              <hr />
            </div>
          ))
        )}
        <div className={s.pagination}>
          <SelectNumber
            value={PacksData.filters.pageCount}
            onChange={onPageCountChange}
            options={[5, 10, 25, 50]}
            disabled={isLoading}
            className={s.select}
          />
          <span>packs on page</span>
          {pagesAmount > 1 && (
            <Pagination
              count={pagesAmount}
              page={PacksData.filters.page}
              onChange={(e, page) => !isLoading && onPageChange(page)}
              shape="rounded"
            />
          )}
        </div>
      </div>
    </div>
  )
}
