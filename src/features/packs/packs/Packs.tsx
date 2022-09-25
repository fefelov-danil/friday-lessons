import React, { useEffect } from 'react'

import Pagination from '@mui/material/Pagination'

import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { Checkbox } from '../../../common/checkbox/Checkbox'
import { DoubleRangeSlider } from '../../../common/DoubleRangeSlider/DoubleRangeSlider'
import { getPacksTC, setFiltersAC, setMyPacksAC, setPageAC, setPageCountAC } from '../packs-reducer'

export const Packs = () => {
  const dispatch = useAppDispatch()
  const PacksData = useAppSelector(state => state.packs)
  const userId = useAppSelector(state => state.auth.user?._id)
  const pagesAmount = Math.round(PacksData.cardPacksTotalCount / PacksData.filters.pageCount)

  useEffect(() => {
    const filtersFromSS = sessionStorage.getItem('filters') // SS - SessionStorage

    filtersFromSS && dispatch(setFiltersAC(JSON.parse(filtersFromSS)))
  }, [])

  useEffect(() => {
    dispatch(getPacksTC(PacksData.filters))
  }, [PacksData.filters])

  const onPageChange = (page: number) => {
    dispatch(setPageAC(page))
  }
  const onMyPacksChange = (myPacks: boolean) => {
    dispatch(setMyPacksAC(myPacks ? `${userId}` : ''))
  }
  const onPageCountChange = (pageCount: number) => {
    dispatch(setPageCountAC(pageCount))
  }

  return (
    <div>
      <Checkbox
        checked={!!PacksData.filters.myPacks}
        onChange={e => onMyPacksChange(e.currentTarget.checked)}
      >
        Only my packs
      </Checkbox>
      <DoubleRangeSlider />
      {PacksData.cardPacks.map(p => (
        <div key={p._id}>
          Name: {p.name} <br />
          Cards count:{p.cardsCount}
          <hr />
        </div>
      ))}
      <select
        value={PacksData.filters.pageCount}
        onChange={e => onPageCountChange(+e.currentTarget.value)}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>
      <Pagination
        count={pagesAmount}
        page={PacksData.filters.page}
        onChange={(e, page) => onPageChange(page)}
        variant="outlined"
        shape="rounded"
      />
    </div>
  )
}
