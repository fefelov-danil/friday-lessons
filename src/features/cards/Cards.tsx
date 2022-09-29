import React, { useEffect, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SchoolIcon from '@mui/icons-material/School'
import Pagination from '@mui/material/Pagination'
import { Navigate, useParams } from 'react-router-dom'

import { appSetStatusAC } from '../../app/app-reducer'
import { useAppDispatch, useAppSelector, useDebounce } from '../../app/hooks'
import { Button } from '../../common/button/Button'
import { InputText } from '../../common/inputText/InputText'
import { LinkToPacks } from '../../common/linkToPacks/LinkToPacks'
import { SelectNumber } from '../../common/select/SelectNumber'
import { parseDate } from '../../utils/parse-date-util'
import { deletePackTC, updatePackTC } from '../packs/packs-reducer'

import {
  addCardTC,
  deleteCardTC,
  getCardsTC,
  setCardsAC,
  setCardsFiltersAC,
  setCardsPageAC,
  setCardsPageCountAC,
  setCardsSearchValueAC,
  setDeletedPackAC,
  setSortCardsAC,
  updateCardTC,
} from './cards-reducer'
import s from './Cards.module.css'

export const Cards = () => {
  const dispatch = useAppDispatch()
  const cardsData = useAppSelector(state => state.cards)
  const editor = useAppSelector(state => state.auth.user?._id) === cardsData.creatorId
  const filters = cardsData.filters

  const { packId, packName } = useParams()
  const isLoading = 'loading' === useAppSelector(state => state.app.appStatus)
  const pagesAmount = Math.ceil(cardsData.cardsTotalCount / filters.pageCount)

  const [searchLocalVal, setSearchLocalVal] = useState('')
  const searchDebVal = useDebounce(searchLocalVal, 500)

  useEffect(() => {
    dispatch(appSetStatusAC('loading'))
    if (!cardsData.cardsFetched) {
      const filtersFromSS = sessionStorage.getItem('cards-filters') // SS - SessionStorage

      if (filtersFromSS) {
        const parsedFiltersFromSS = JSON.parse(filtersFromSS)

        dispatch(setCardsFiltersAC(parsedFiltersFromSS))
        packId && dispatch(getCardsTC(packId, parsedFiltersFromSS))
      } else {
        packId && dispatch(getCardsTC(packId, filters))
      }
    }
  }, [])
  useEffect(() => {
    dispatch(appSetStatusAC('loading'))
    dispatch(setCardsAC([]))
    if (cardsData.cardsFetched) {
      packId && dispatch(getCardsTC(packId, filters))
    }
  }, [
    cardsData.cardsChanged,
    filters.page,
    filters.pageCount,
    filters.searchValue,
    filters.sortCards,
  ])

  useEffect(() => {
    dispatch(setCardsSearchValueAC(searchDebVal))
  }, [searchDebVal])

  const onDeletePackHandler = (id: string) => {
    dispatch(appSetStatusAC('loading'))
    dispatch(deletePackTC(id))
  }
  const onUpdatePackHandler = (id: string) => {
    dispatch(appSetStatusAC('loading'))
    dispatch(updatePackTC(id))
  }
  const onAddCardHandler = () => {
    dispatch(appSetStatusAC('loading'))
    packId && dispatch(addCardTC(packId, 'hardcoded question', 'hardcoded answer'))
  }
  const onUpdateCardHandler = (cardId: string) => {
    dispatch(appSetStatusAC('loading'))
    dispatch(updateCardTC(cardId, 'changed question', 'changed answer'))
  }
  const onDeleteCardHandler = (cardId: string) => {
    dispatch(appSetStatusAC('loading'))
    dispatch(deleteCardTC(cardId))
  }
  const onPageChange = (page: number) => {
    dispatch(setCardsPageAC(page))
  }
  const onPageCountChange = (pageCount: number) => {
    dispatch(setCardsPageAC(1))
    dispatch(setCardsPageCountAC(pageCount))
  }
  const onSortChangeHandler = (sortParam: string) => {
    dispatch(setCardsPageAC(1))
    if (filters.sortCards.substring(1) !== sortParam) {
      dispatch(setSortCardsAC(`1${sortParam}`))
    } else {
      if (filters.sortCards.split('')[0] === '0') {
        dispatch(setSortCardsAC(`1${sortParam}`))
      } else {
        dispatch(setSortCardsAC(`0${sortParam}`))
      }
    }
  }

  let sortIcon = <ArrowDropDownIcon />

  if (filters.sortCards && filters.sortCards.split('')[0] === '0') {
    sortIcon = <ArrowDropUpIcon />
  }

  if (cardsData.deletedPack) {
    dispatch(setDeletedPackAC(false))

    return <Navigate to={'/packs'} />
  }

  return (
    <div className={s.cardsPage}>
      <div className={s.cardsContainer}>
        <LinkToPacks />
        <div className={s.titleAndButtons}>
          <div className={s.titleContainer}>
            <h1>{packName}</h1>
            {editor && (
              <>
                <EditIcon
                  className={s.action}
                  onClick={() => !isLoading && onUpdatePackHandler(packId || '')}
                />
                <DeleteIcon
                  className={s.action}
                  onClick={() => !isLoading && onDeletePackHandler(packId || '')}
                />
              </>
            )}
          </div>
          <div className={s.buttonsContainer}>
            {editor && (
              <Button onClick={onAddCardHandler}>
                <AddIcon />
                Add Card
              </Button>
            )}
            <Button>
              <SchoolIcon />
              Learn Pack
            </Button>
          </div>
        </div>
        <InputText
          placeholder="Enter question"
          value={searchLocalVal}
          onChange={e => !isLoading && setSearchLocalVal(e.currentTarget.value)}
        />
        <table className={s.cardsTable}>
          <thead>
            <tr>
              <th>
                <p className={s.sort} onClick={() => !isLoading && onSortChangeHandler('question')}>
                  Question
                  {filters.sortCards.substring(1) === 'question' && sortIcon}
                </p>
              </th>
              <th>Answers</th>
              <th>
                <p className={s.sort} onClick={() => !isLoading && onSortChangeHandler('updated')}>
                  Updated
                  {filters.sortCards.substring(1) === 'updated' && sortIcon}
                </p>
              </th>
              <th>
                <p className={s.sort} onClick={() => !isLoading && onSortChangeHandler('grade')}>
                  Grade
                  {filters.sortCards.substring(1) === 'grade' && sortIcon}
                </p>
              </th>
              {editor && <th></th>}
            </tr>
          </thead>
          <tbody>
            {cardsData.cards.map(c => (
              <tr key={c._id}>
                <td>{c.question}</td>
                <td>{c.answer}</td>
                <td>{parseDate(c.updated)}</td>
                <td>{c.grade}</td>
                {editor && (
                  <td>
                    <>
                      <EditIcon
                        className={s.action}
                        onClick={() => !isLoading && onUpdateCardHandler(c._id)}
                      />
                      <DeleteIcon
                        className={s.action}
                        onClick={() => !isLoading && onDeleteCardHandler(c._id)}
                      />
                    </>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {cardsData.noResults && <div className={s.noResults}>No cards here</div>}
        <div className={s.pagination}>
          <SelectNumber
            value={filters.pageCount}
            onChange={onPageCountChange}
            options={[10, 15, 25, 50]}
            disabled={isLoading}
            className={s.select}
          />
          <span>cards on page</span>
          {pagesAmount > 1 && (
            <Pagination
              count={pagesAmount}
              page={filters.page}
              onChange={(e, page) => !isLoading && onPageChange(page)}
              shape="rounded"
            />
          )}
        </div>
      </div>
    </div>
  )
}
