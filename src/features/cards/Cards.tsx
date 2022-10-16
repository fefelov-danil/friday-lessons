import React, { useEffect, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import SchoolIcon from '@mui/icons-material/School'
import Pagination from '@mui/material/Pagination'
import { useNavigate, useParams } from 'react-router-dom'

import { appSetStatusAC } from '../../app/app-reducer'
import { useAppDispatch, useAppSelector, useDebounce } from '../../app/hooks'
import img_not_available from '../../assets/images/Image_not_available.png'
import { Button } from '../../common/button/Button'
import { InputText } from '../../common/inputText/InputText'
import { AddPackModal } from '../../common/modals/AddCardModal/AddCardModal'
import { DeleteCardModal } from '../../common/modals/DeleteCardModal/DeleteCardModal'
import { DeletePackModal } from '../../common/modals/DeletePackModal/DeletePackModal'
import { UpdateCardModal } from '../../common/modals/UpdateCardsModal/UpdateCardModal'
import { UpdatePackModal } from '../../common/modals/UpdatePackModal/UpdatePackModal'
import { Rating } from '../../common/rating/Rating'
import { SelectNumber } from '../../common/select/SelectNumber'
import { parseDate } from '../../utils/parse-date-util'

import {
  CardType,
  getCardsTC,
  setCardsAC,
  setCardsFiltersAC,
  setCardsPageAC,
  setCardsPageCountAC,
  setCardsSearchValueAC,
  setSortCardsAC,
  setUpdatedPackAC,
} from './cards-reducer'
import s from './Cards.module.css'

import { BackArrowButton } from 'common/BackArrowButton/BackArrowButton'

export const Cards = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { packId, packName } = useParams()
  const cardsData = useAppSelector(state => state.cards)
  const deckCover = cardsData.deckCover
  const editor = useAppSelector(state => state.auth.user?._id) === cardsData.creatorId
  const filters = cardsData.filters
  const isLoading = 'loading' === useAppSelector(state => state.app.appStatus)
  const pagesAmount = Math.ceil(cardsData.cardsTotalCount / filters.pageCount)

  const [searchLocalVal, setSearchLocalVal] = useState('')
  const searchDebVal = useDebounce(searchLocalVal, 500)

  useEffect(() => {
    dispatch(appSetStatusAC('loading'))
    if (!cardsData.cardsFetched) {
      dispatch(setUpdatedPackAC(''))
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

  const onPageChange = (page: number) => {
    dispatch(setCardsAC([]))
    dispatch(setCardsPageAC(page))
  }
  const onPageCountChange = (pageCount: number) => {
    dispatch(setCardsAC([]))
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
  const openLearnPage = () => {
    navigate(`/learn/${packId}/${packName}`)
  }

  let sortIcon = <ArrowDropDownIcon />

  if (filters.sortCards && filters.sortCards.split('')[0] === '0') {
    sortIcon = <ArrowDropUpIcon />
  }

  const deletedPack = () => {
    navigate('/packs')
  }

  const changePackName = (newName: string) => {
    navigate(`/packs/${packId}/${newName}`)
  }

  return (
    <div className="page">
      <div className={s.arrowButton}>
        <BackArrowButton />
      </div>
      <div className="pageContainer">
        <div className={s.titleAndButtons}>
          <div className={s.titleContainer}>
            <img
              className={s.deckAva}
              src={deckCover ? deckCover : img_not_available}
              alt="not_available"
            />
            <h1>{packName}</h1>
            {editor && (
              <>
                <UpdatePackModal
                  openButton={<EditIcon className="action" />}
                  name={packName ? packName : ''}
                  id={packId ? packId : ''}
                  deckCover={deckCover ? deckCover : img_not_available}
                  fromCards={true}
                  callBack={changePackName}
                />

                <DeletePackModal
                  title={packName ? packName : ''}
                  id={packId ? packId : ''}
                  openButton={<DeleteIcon className="action" />}
                  fromCards={true}
                  callBack={deletedPack}
                />
              </>
            )}
          </div>
          <div className={s.buttonsContainer}>
            {editor && (
              <AddPackModal
                packId={packId ? packId : ''}
                openButton={
                  <Button>
                    <AddIcon />
                    Add Card
                  </Button>
                }
              />
            )}
            <Button
              disabled={cardsData.cards.length === 0}
              onClick={() => cardsData.cards.length !== 0 && openLearnPage()}
            >
              <SchoolIcon />
              Learn Pack
            </Button>
          </div>
        </div>
        <h3>
          {cardsData.cardsTotalCount === 1
            ? cardsData.cardsTotalCount + ' card'
            : cardsData.cardsTotalCount + ' cards'}
        </h3>
        <InputText
          placeholder="Enter question"
          value={searchLocalVal}
          onChange={e => !isLoading && setSearchLocalVal(e.currentTarget.value)}
          className={s.cardsSearch}
        />
        <table className="table">
          <tbody>
            <tr>
              <th>
                <p className="sort" onClick={() => !isLoading && onSortChangeHandler('question')}>
                  Questions
                  {filters.sortCards.substring(1) === 'question' && sortIcon}
                </p>
              </th>
              <th>Answers</th>
              <th>
                <p className="sort" onClick={() => !isLoading && onSortChangeHandler('updated')}>
                  Updated
                  {filters.sortCards.substring(1) === 'updated' && sortIcon}
                </p>
              </th>
              <th>
                <p className="sort" onClick={() => !isLoading && onSortChangeHandler('grade')}>
                  Grade
                  {filters.sortCards.substring(1) === 'grade' && sortIcon}
                </p>
              </th>
              {editor && <th></th>}
            </tr>
            {cardsData.cards.map((c: CardType) => (
              <tr key={c._id} className={isLoading ? 'loading' : ''}>
                <td>
                  {c.questionImg ? (
                    <div className={s.cardImages}>
                      <img src={c.questionImg ? c.questionImg : ''} alt="error" />
                    </div>
                  ) : (
                    c.question
                  )}
                </td>
                <td>
                  {c.answerImg ? (
                    <div className={s.cardImages}>
                      <img src={c.answerImg ? c.answerImg : ''} alt="error" />
                    </div>
                  ) : (
                    c.answer
                  )}
                </td>
                <td>{parseDate(c.updated)}</td>
                <td>
                  <Rating value={c.grade} />
                </td>
                {editor && (
                  <td>
                    <div className="actionsContainer">
                      <UpdateCardModal
                        openButton={<EditIcon className="action" />}
                        id={c._id}
                        question={c.question}
                        answer={c.answer}
                        questionImg={c.questionImg ? c.questionImg : ''}
                        answerImg={c.answerImg ? c.answerImg : ''}
                      />

                      <DeleteCardModal
                        openButton={<DeleteIcon className="action" />}
                        title={c.question}
                        id={c._id}
                      />
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {cardsData.noResults && <div className="noResults">No cards here</div>}
        <div className="pagination">
          <SelectNumber
            value={filters.pageCount}
            onChange={onPageCountChange}
            options={[10, 15, 25, 50]}
            disabled={isLoading}
            className="select"
          />
          <span>packs on page</span>
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
