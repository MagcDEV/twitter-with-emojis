import React from 'react'
import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/Layout";
import { CreatePostWizard } from "~/components/CreatePostWizard";
import { Feed } from "~/components/Feed";

const Home: NextPage = () => {

  const { isLoaded: userLoaded, isSignedIn } = useUser();

  api.posts.getAll.useQuery();

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