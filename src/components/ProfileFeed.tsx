import React from 'react'
import Loading from "~/components/Loading";
import { api } from "~/utils/api";
import { PostView } from "~/components/PostView";

export const ProfileFeed = (props: { userId: string }) => {

  const { data, isLoading } = api.posts.getPostByUserId.useQuery({ userId: props.userId })

  if (isLoading) return (
    <div className="flex h-screen w-screen flex-col justify-center items-center">
      <Loading size={20} />
    </div>
  );

  if (!data || data.length === 0) return <div>no posts</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  )
}