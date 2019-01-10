<template>
  <component :is="currentLayout" :class="layoutClasses">
    <router-view :class="pageWrapperClasses"></router-view>
  </component>
</template>

<script>
export default {
  props: {
    layouts: {
      type: Object,
      default: () => {}
    },

    current: {
      type: String,
      default: null
    },

    layoutClasses: {
      type: [Object, Array],
      default: () => ["layout"]
    },

    pageWrapperClasses: {
      type: [Object, Array],
      default: () => ["page-wrapper"]
    }
  },

  computed: {
    currentLayout() {
      return this.layouts[this.current];
    }
  }
};
</script>
