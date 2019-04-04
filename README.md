# Vue-Layouter - One layout to rule them all

## Project setup

```bash
npm install layouter
```

## Usage

First you need to describe layout in router.js

```js
//...

routes: [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      layout: "HomeLayout"
    }
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "./views/About.vue"),
    meta: {
      layout: "AboutLayout"
    }
  }
]

//...
```

After that import layouter in your App.vue

```js
<template>
  <div id="app">
    <Layouter :layouts="$options.LAYOUTS" :current="$route.meta.layout"></Layouter>
  </div>
</template>

<script>
import Layouter from "vue-layouter";
import HomeLayout from "@/Layouts/HomeLayout";
import AboutLayout from "@/Layouts/AboutLayout";

const LAYOUTS = {
  HomeLayout,
  AboutLayout
};

export default {
  components: {
    Layouter
  },
  LAYOUTS
};
</script>
```

And there you go. You can rule layouts as a king 🤴.

## Props

| Prop               | Required | Type            | Default          | Description                                                        |
| ------------------ | -------- | --------------- | ---------------- | ------------------------------------------------------------------ |
| layouts            | false    | Object          | {}               | List of available layouts                                          |
| current            | false    | String          | null             | Layout to show                                                     |
| layoutClasses      | false    | [Object, Array] | ['layout']       | Classes you want to ass to your layout parent element              |
| pageWrapperClasses | false    | [Object, Array] | ['page-wrapper'] | Classes you want to add to `<router-view>` that contains your layout |
