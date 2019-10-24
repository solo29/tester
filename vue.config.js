module.exports = {
  transpileDependencies: ["vuetify"],
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === "production" ? "/tester/dist/" : ""
  //assetsDir: process.env.NODE_ENV === "production" ? "/tester/dist/" : ""
};
