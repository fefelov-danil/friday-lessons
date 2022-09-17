import React from 'react'

import 'assets/general-css/reset.css'
import 'assets/general-css/App.css'
import { Pages } from 'app/Pages'
import { Header } from 'common/header/Header'

const App = () => {
  return (
    <div className="App">
      <Header />
      <Pages />
    </div>
  )
}

export default App
