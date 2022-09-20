import React, { useEffect } from 'react'

import 'assets/general-css/reset.css'
import 'assets/general-css/App.css'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'

import { useAppDispatch, useAppSelector } from 'app/hooks'
import { Pages } from 'app/Pages'
import ErrorSnackbar from 'common/errorSnackbar/ErrorSnackbar'
import { Header } from 'common/header/Header'
import { isAuthLoadingTC } from 'features/auth/auth-reducer'

const App = () => {
  const dispatch = useAppDispatch()
  const appStatus = useAppSelector(state => state.app.status)
  const isAuthLoading = useAppSelector(state => state.app.isAuthLoading)

  useEffect(() => {
    isAuthLoading && dispatch(isAuthLoadingTC())
  }, [isAuthLoading])

  return (
    <div className="App">
      {isAuthLoading ? (
        <div className={'circularProgress'}>
          <CircularProgress />
        </div>
      ) : (
        <div>
          <div className={'linear-progress'}>{appStatus === 'loading' && <LinearProgress />}</div>
          <Header />
          <Pages />
          <ErrorSnackbar />
        </div>
      )}
    </div>
  )
}

export default App
