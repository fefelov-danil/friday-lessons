import React from 'react'

import { useAppDispatch } from 'app/hooks'
import { deleteMe } from 'features/auth/auth-reducer'

export const Profile = () => {
  const dispatch = useAppDispatch()

  return (
    <div>
      <h1>Profile</h1>
      <button onClick={() => dispatch(deleteMe())}>Log Out</button>
    </div>
  )
}
