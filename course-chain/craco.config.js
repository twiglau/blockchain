const path = require("path");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const WorkerPlugin = require("worker-plugin");

const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = {
  webpack: {
    alias: {
      "@": resolve("src"),
      components: resolve("src/components"),
    },
    plugins: {
      add: [
        new NodePolyfillPlugin({
          excludeAliases: ["console"],
        }),
        new WorkerPlugin({
          preserveTypeModule: true,
          globalObject: "self",
        }),
      ],
    },
    mode: "extends",
    configure: {
      module: {
        rules: [
          {
            test: /\.js$/,
            enforce: "pre",
            use: ["source-map-loader"],
          },
        ],
      },
      ignoreWarnings: [/Failed to parse source map/],
    },
  },
};
