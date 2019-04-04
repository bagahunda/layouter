<template>
  <div id="app">
    <Layouter :layouts="$options.LAYOUTS" :current="$route.meta.layout"></Layouter>
  </div>
</template>

<script>
import Layouter from "@/components/Layouter";
import HomeLayout from "@/Layouts/HomeLayout";
import AboutLayout from "@/Layouts/AboutLayout";
import NewsLayout from "@/Layouts/NewsLayout";

const LAYOUTS = {
  HomeLayout,
  AboutLayout,
  NewsLayout
};

export default {
  components: {
    Layouter
  },
  LAYOUTS
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
