import { type RouterOutputs } from "~/utils/api";
import React from 'react'
import Image from "next/image";
import dayjs from "dayjs";
import realtiveTime from "dayjs/plugin/relativeTime";
dayjs.extend(realtiveTime);

import Link from "next/link";
type PostWithUser = RouterOutputs["posts"]["getAll"][number]
export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className=" flex p-4 border-b border-slate-400" key={post.id}>
      <Image width={56} height={56} className="h-14 w-14 rounded-full" src={author.profileImageUrl} alt="Profile Image" />
      <div className="flex flex-col ml-4">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>@{author.username}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{` · ${dayjs(post.createdAt).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">
          {post.content}
        </span>
      </div>
    </div>
  )

}