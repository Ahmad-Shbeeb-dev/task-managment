"use client";

import { useState } from "react";

import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

export function CreatePostForm() {
  const context = api.useContext();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // const { mutateAsync: createPost, error } = api.post.create.useMutation({
  //   async onSuccess() {
  //     setTitle("");
  //     setContent("");
  //     await context.post.all.invalidate();
  //   },
  // });

  return (
    <form
      className="flex w-full max-w-2xl flex-col"
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          // await createPost({
          //   title,
          //   content,
          // });
          setTitle("");
          setContent("");
          await context.post.all.invalidate();
        } catch {
          // noop
        }
      }}
    >
      <input
        className="mb-2 rounded bg-white/10 p-2 text-white"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      {error?.data?.zodError?.fieldErrors.title && (
        <span className="mb-2 text-red-500">
          {error.data.zodError.fieldErrors.title}
        </span>
      )}
      <input
        className="mb-2 rounded bg-white/10 p-2 text-white"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
      />
      {error?.data?.zodError?.fieldErrors.content && (
        <span className="mb-2 text-red-500">
          {error.data.zodError.fieldErrors.content}
        </span>
      )}
      {}
      <button type="submit" className="rounded bg-pink-400 p-2 font-bold">
        Create
      </button>
      {error?.data?.code === "UNAUTHORIZED" && (
        <span className="mt-2 text-red-500">You must be logged in to post</span>
      )}
    </form>
  );
}

export function PostList({
  initialPosts,
}: {
  initialPosts?: RouterOutputs["post"]["all"];
}) {
  //useSuspenseQuery is EXPERIMINTAL//
  //delegate loading and error handling to the outside of the component and focus on success inside the component.
  const [posts] = api.post.all.useSuspenseQuery(); //server side fetching (like getServerSideProps) with data streaming but for client component (must use Suspense at top page)
  // const { data: posts } = api.post.all.useQuery(undefined, {
  //   initialData: initialPosts,
  // }); //client side fetching with pre rendered data  without streaming (no suspense needed at top page)

  // const { data: posts } = api.post.all.useQuery(); //client side
  // console.log("123");
  // const posts = [{ id: "123", name: "asd", emai: "asd@asd" }];

  // const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
  //   cache: "no-store",
  //   // next: {
  //   //   revalidate: 2,
  //   // },
  // });
  // const data = await res.json();
  // if (!posts) return <h2>Loading...</h2>;
  return (
    <div className="flex w-full flex-col gap-4">
      {/* <Button variant="destructive">Button</Button> */}

      {posts.map((p) => {
        return <PostCard key={p.id} post={p} />;
      })}
      {/* {JSON.stringify(data)} */}
    </div>
  );
}

export function PostCard(props: {
  post: RouterOutputs["post"]["all"][number];
}) {
  const context = api.useContext();
  const deletePost = api.post.delete.useMutation();

  return (
    <div className="flex flex-row rounded-lg bg-white/10 p-4 transition-all hover:scale-[101%]">
      <div className="flex-grow">
        <h2 className="text-2xl font-bold text-pink-400">{props.post.name}</h2>
        <p className="mt-2 text-sm">{props.post.email}</p>
      </div>
      <div>
        <button
          className="cursor-pointer text-sm font-bold uppercase text-pink-400"
          onClick={async () => {
            await deletePost.mutateAsync(props.post.id);
            await context.post.all.invalidate();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function PostCardSkeleton(props: { pulse?: boolean }) {
  const { pulse = true } = props;
  return (
    <div className="flex flex-row rounded-lg bg-white/10 p-4 transition-all hover:scale-[101%]">
      <div className="flex-grow">
        <h2
          className={`w-1/4 rounded bg-pink-400 text-2xl font-bold ${
            pulse && "animate-pulse"
          }`}
        >
          &nbsp;
        </h2>
        <p
          className={`mt-2 w-1/3 rounded bg-current text-sm ${
            pulse && "animate-pulse"
          }`}
        >
          &nbsp;
        </p>
      </div>
    </div>
  );
}
