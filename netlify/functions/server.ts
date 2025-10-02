const { createRequestHandler } = require("@netlify/remix-adapter");

// Import the server build
const build = require("../server/index.js");

export const handler = createRequestHandler({
  build,
  mode: process.env.NODE_ENV,
});
