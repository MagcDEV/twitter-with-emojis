import React from 'react'

const Loading = (props: { size?: number }) => {
    return (
        <div className={`border-gray-300 h-${props.size ?? 20} w-${props.size ?? 20} animate-spin rounded-full border-8 border-t-blue-400`} />
    )
}

export default Loading