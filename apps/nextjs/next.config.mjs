// Importing env files here to validate on build
import "./src/env.mjs";
import "@acme/auth/env.mjs";

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ["@acme/api", "@acme/auth", "@acme/db"],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // output: "standalone",
  // webpack: (config, { isServer }) => {
  // config.resolve.fallback = {
  //   ...config.resolve.fallback, // if you miss it, all the other options in fallback, specified
  //   // by next.js will be dropped. Doesn't make much sense, but how it is
  //   fs: false, // the solution
  // };
  // config.resolve.fallback = { fs: false,  path: false };
  // return config;
  // },
};

export default config;
