import React from 'react'

const Loading = () => {
    return (
        <div className='absolute top-0 right-0 flex h-screen w-screen justify-center items-center'>
            <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-400" />
        </div>
    )
}

export default Loading