"use client";

// import { useEffect } from "react";
// import { redirect, useRouter } from "next/navigation";

// import { useAuth } from "~/hooks";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  // if (error.message === "UNAUTHORIZED") {
  // redirect("/signin");
  // }

  // const router = useRouter();
  // const { signout } = useAuth();
  // useEffect(() => {
  //   if (error.message === "UNAUTHORIZED") {
  //     void signout();
  //   }
  // }, [error.message]);

  return (
    <>
      <p>Something went wrong!</p>
      <h1>{error.message || "Something went wrong"}</h1>
      <button onClick={() => reset()}>Try again</button>
    </>
  );
}
