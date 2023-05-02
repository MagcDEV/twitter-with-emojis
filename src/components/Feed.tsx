import { api } from "~/utils/api";
import React from 'react'
import Loading from "~/components/Loading";
import { PostView } from "~/components/PostView";

export const Feed = () => {
    const { data, isLoading: postLoading } = api.posts.getAll.useQuery();

    if (postLoading) return (
        <div className='absolute top-0 right-0 flex h-screen w-screen justify-center items-center'>
            <Loading size={20} />
        </div>
    )

    return (
        <div className="flex flex-col">
            {data?.map((fullPost) => <PostView {...fullPost} key={fullPost.post.id} />)}
        </div>

    )
}