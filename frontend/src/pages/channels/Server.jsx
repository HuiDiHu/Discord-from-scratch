import React from 'react'
import { useParams } from 'react-router-dom'

const Server = () => {
  const { id } = useParams()

  return (
    <div>
      Server id: {id}
    </div>
  )
}

export default Server