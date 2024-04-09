<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->

    <div class="wrapper">
      <HelloWorld msg="前端技术预研!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/nav">NavView-CSDN-1</RouterLink>
        <RouterLink to="/navAPI">NavAPI-Self-探索2</RouterLink>
        <RouterLink to="/navFilter">NavAPI-Filter-探索3</RouterLink>
        <RouterLink to="/navAPIButtons">NavAPI-Buttons-探索4</RouterLink>
        <RouterLink to="/preResearch">Vue-功能探索-1</RouterLink>
      </nav>
    </div>
  </header>

  <section class="router_section">
    <RouterView />
  </section>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  height: 100vh;
  width: 20vw;
  display: flex;
  flex-wrap: wrap;
  place-items: center;
  background-color: lightcyan;
}

header .wrapper {
  width: 100%;
  display: flex;
  place-items: flex-start;
  flex-wrap: wrap;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  text-align: left;
  font-size: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
  color: #ffffff;
  background-color: lightseagreen !important;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  display: block;
  width: 100%;
  padding: 16px;
}

nav a:first-of-type {
  border: 0;
}

.router_section {
  width: 80vw;
  max-height: 100vh;
  overflow-y: auto;
}

/* @media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
