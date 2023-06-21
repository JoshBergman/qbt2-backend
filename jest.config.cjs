module.exports = {
  transform: {
    "^.+\\.m?js$": "babel-jest",
  },
  testMatch: ["**/Tests/**/*.test.mjs"],
  moduleFileExtensions: ["js", "mjs"],
};
