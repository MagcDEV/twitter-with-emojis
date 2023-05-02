import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import React, { useState } from 'react'
import Image from "next/image";
import dayjs from "dayjs";
import realtiveTime from 'dayjs/plugin/relativeTime';
import Loading from "~/components/Loading";
import { toast } from "react-hot-toast";

dayjs.extend(realtiveTime);

export const CreatePostWizard = () => {
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