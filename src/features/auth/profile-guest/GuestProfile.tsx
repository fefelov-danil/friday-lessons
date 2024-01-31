import { useEffect } from 'react'

import BookOutlinedIcon from '@mui/icons-material/BookOutlined'
import PermContactCalendarOutlinedIcon from '@mui/icons-material/PermContactCalendarOutlined'
import { Avatar, Skeleton } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

import { getGuestUserProfileThunk } from '../auth-reducer'

import s from './GuestProfile.module.css'

import { useAppDispatch, useAppSelector } from 'app/hooks'
import { BackArrowButton } from 'common/BackArrowButton/BackArrowButton'
import { Button } from 'common/button/Button'
import { parseDate } from 'utils/parse-date-util'

export const GuestProfile = () => {
  const guestUser = useAppSelector(state => state.auth.guestUser)
  const statusApp = useAppSelector(state => state.app.appStatus)
  const dispatch = useAppDispatch()
  const { userId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    userId && dispatch(getGuestUserProfileThunk(userId))
  }, [userId])

  const showGuestPacks = (id: string | undefined, packsCount: number | undefined) => {
    navigate('/packs', { state: { id, packsCount } })
  }

  return (
    <div className="formPage">
      <div className={s.arrowButton}>
        <BackArrowButton />
      </div>
      <div className={'formContainer ' + s.profileContainer}>
        {guestUser && statusApp !== 'loading' ? (
          <>
            <Avatar alt="avatar" src={guestUser?.avatar} sx={{ width: 140, height: 140 }} />

            <div className={s.mainData}>
              <p className={s.username}>{guestUser?.name}</p>
              <p className={s.email}>{guestUser?.email}</p>
              <Button
                className={s.profileButton}
                onClick={() => showGuestPacks(guestUser?._id, guestUser?.publicCardPacksCount)}
              >
                Repositories
              </Button>
            </div>

            <div className={s.secondaryData}>
              <div className={s.smallText}>
                <BookOutlinedIcon style={{ color: '#57606a', fontSize: '16px' }} />
                <p>
                  <span>{guestUser?.publicCardPacksCount}</span> repositiories
                </p>
              </div>

              <p>&nbsp;·&nbsp;</p>

              <div className={s.smallText}>
                <PermContactCalendarOutlinedIcon style={{ color: '#57606a', fontSize: '16px' }} />
                <p>{parseDate(guestUser?.created, true)} created</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <Skeleton variant="circular" width={140} height={140} />
            <Skeleton variant="rectangular" width={180} height={30} />
            <Skeleton variant="rectangular" width={210} height={26} />
            <Skeleton variant="rounded" width={180} height={44} style={{ borderRadius: '50px' }} />
            <Skeleton variant="text" width={210} height={22} />
          </>
        )}
      </div>
    </div>
  )
}
