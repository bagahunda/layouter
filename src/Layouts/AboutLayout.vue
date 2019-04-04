<template>
  <div class="about">
    <div class="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/news">News</router-link>
    </div>
    <div class="main-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
.about {
  display: flex;
  max-width: 1000px;
  margin: 0 auto;
  box-sizing: border-box;
}

.nav {
  width: 300px;
  flex-grow: 1;
  padding: 30px;
  display: flex;
  flex-direction: column;
}

.main-content {
  min-width: 80%;
  flex-grow: 9999;
  padding: 30px;
}

.nav a {
  font-weight: bold;
  color: #2c3e50;
}

.nav a.router-link-exact-active {
  color: #42b983;
}
</style>