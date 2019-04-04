module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.(glsl|frag|vert)$/,
          use: ["glslify-import-loader", "raw-loader", "glslify-loader"]
        }
      ]
    }
  }
};
