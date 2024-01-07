import { url } from "inspector";
import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });
  const session = await getServerAuthSession();

  // return (
  //   <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#a990cb] to-[#282a5e] text-white ">
  //     <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
  //       <div className="flex flex-col items-center gap-2">
  //         <p className="text-2xl text-white">
  //           {hello ? hello.greeting : "Loading tRPC query..."}
  //         </p>

  //         <div className="flex flex-col items-center justify-center gap-4">
  //           <p className="text-center text-2xl text-white">
  //             {session && <span>Logged in as {session.user?.name}</span>}
  //           </p>
  //           <Link
  //             href={session ? "/api/auth/signout" : "/api/auth/signin"}
  //             className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
  //           >
  //             {session ? "Sign out" : "Sign in"}
  //           </Link>
  //         </div>
  //       </div>

  //       <CrudShowcase />
  //     </div>
  //   </main>
  // );
  return (
    <main className=" flex h-full min-h-screen w-full flex-col  ">
      <div
        className="flex h-[80vh]  w-full bg-cover bg-no-repeat "
        style={{
          backgroundImage: 'url("/images/1_0FqDC0_r1f5xFz3IywLYRA.jpg")',
        }}
      >
        <div className="m-auto mr-[55vw] flex flex-col gap-10">
          <div className=" text-6xl "> Welcome to Programing</div>
          <div className="text-center text-2xl">projects</div>
        </div>
      </div>
      <div className="w-full bg-gray-100">
        <div className="mx-auto my-5 flex w-[40%] flex-col items-center justify-center gap-10 rounded-md  p-6 shadow-2xl">
          <div className="text-3xl">Projects</div>
          <div className="flex gap-20">
            <div className="text-2xl">minesweper</div>
            <img
              src="/images/pic01.png"
              className="h-96 w-96 rounded-md drop-shadow-xl"
            ></img>
          </div>
          <div className="flex gap-20">
            <img
              src="/images/board_img.png"
              className="h-96 w-96 rounded-md drop-shadow-xl"
            ></img>
            <div className="text-2xl">chess</div>
          </div>
          <div></div>
          <div></div>
        </div>
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
