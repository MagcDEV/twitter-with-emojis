import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";

import { api } from "~/utils/api";

import React, { useState } from 'react'
import Image from "next/image";
import dayjs from "dayjs";

import realtiveTime from 'dayjs/plugin/relativeTime';
import Loading from "~/components/Loading";
import { toast } from "react-hot-toast";
import { PageLayout } from "~/components/Layout";
import { PostView } from "~/components/PostView";

dayjs.extend(realtiveTime);

const CreatePostWizard = () => {
  const { user } = useUser()
  const [input, setInput] = useState<string>("")

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Plase try again later")
      }
    }
  });

  if (!user) return null;

  return (
    <div className="flex gap-5">
      <Image width={56} height={56} className="h-14 w-14 rounded-full" src={user.profileImageUrl} alt="Profile Image" />
      <input
        placeholder="Type some emojis!"
        className=" bg-transparent grow"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input });
            }
          }
        }}
      />
      {input !== "" && !isPosting && (
        <button
          className=" ml-32" onClick={() => mutate({ content: input })}>
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <Loading size={10} />
        </div>
      )}
    </div>
  )
}

const Feed = () => {
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

const Home: NextPage = () => {

  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();

  // Return empty div if user isn't loeaded
  if (!userLoaded) return <div />

  return (
    <>
      <PageLayout>
        <div className="flex border-b border-slate-400 p-4">
          <div className="">{!isSignedIn && (
            <div className="flex justify-center">
              <SignInButton />
            </div>
          )}{isSignedIn && <CreatePostWizard />}</div>
        </div>
        <Feed />
      </PageLayout>
    </>
  );
};

export default Home;