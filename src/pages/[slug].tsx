import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import React from 'react'
import Loading from "~/components/Loading";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/Layout";
import Image from "next/image";
import { generateSsgHelper } from "~/server/helpers/ssgHelper";
import { ProfileFeed } from "~/components/ProfileFeed";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {

  const { data, isLoading } = api.profile.getUserByUsername.useQuery({ username })

  if (isLoading) return (
    <div className="flex h-screen w-screen flex-col justify-center items-center">
      <Loading size={20} />
    </div>
  )

  if (!data) return <div>404</div>


  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 border-slate-400 bg-slate-600">
          <Image
            width={128}
            height={128}
            src={data.profilePicture}
            alt={`${data.username ?? ""} profile picture`}
            className="-mb-[64px] bg-black absolute bottom-0 left-0 ml-4 rounded-full border-2 border-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">{`@${data.username ?? ""}`}</div>
        <div className="w-full border-b border-slate-400" />
        <ProfileFeed userId={data.id} />
      </PageLayout>
    </>
  );
};


export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSsgHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username })

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username
    },
  }
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export default ProfilePage;