import React from 'react'

const ChannelHeader = ({ props }) => {
  return (
    <div className='min-h-12 w-auto bg-red-800'>
        {props.channelName}
    </div>
  )
}

export default ChannelHeader