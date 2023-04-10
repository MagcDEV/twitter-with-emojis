import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";

import { api, type RouterOutputs } from "~/utils/api";

import React from 'react'
import Image from "next/image";
import dayjs from "dayjs";

import realtiveTime from 'dayjs/plugin/relativeTime';
import Loading from "~/components/Loading";

dayjs.extend(realtiveTime);


const CreatePostWizard = () => {
  const { user } = useUser()

  if (!user) return null;

  return (
    <div className="flex gap-3">
      <Image width={56} height={56} className="h-14 w-14 rounded-full" src={user.profileImageUrl} alt="Profile Image" />
      <input placeholder="Type some emojis!" className=" bg-transparent grow" />
    </div>
  )
}

type PostWithUser = RouterOutputs["posts"]["getAll"][number]

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div className=" flex p-4 border-b border-slate-400" key={post.id}>
      <Image width={56} height={56} className="h-14 w-14 rounded-full" src={author.profileImageUrl} alt="Profile Image" />
      <div className="flex flex-col ml-4">
        <div className="flex gap-1 text-slate-300">
          <span>@{author.username}</span>
          <span className="font-thin">{` · ${dayjs(post.createdAt).fromNow()}`}</span>
        </div>
        <span>
          {post.content}
        </span>
      </div>
    </div>
  )

}

const Feed = () => {
  const { data, isLoading: postLoading } = api.posts.getAll.useQuery();

  if (postLoading) return <Loading />


  return (
    <div className="flex flex-col">
      {data?.map((fullPost) => <PostView {...fullPost} key={fullPost.post.id} />)}
    </div>

  )
}


const Home: NextPage = () => {

  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();

  // Return empty div if user isn't loeaded
  if (!userLoaded) return <div />

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center h-screen">
        <div className=" h-full w-full md:max-w-2xl border-x border-slate-400">
          <div className="flex border-b border-slate-400 p-4">
            <div className="">{!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}{isSignedIn && <CreatePostWizard />}</div>
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;