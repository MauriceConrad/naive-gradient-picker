<template>
  <n-config-provider :theme="darkMode ? darkTheme : lightTheme" :class="{ 'theme-dark': darkMode, 'theme-light': !darkMode }" class="root">
    <header>
      <n-switch v-model:value="darkMode">Dark Mode</n-switch>
    </header>
    <main>
      <n-gradient-picker v-model:value="gradient1" />
    </main>
  </n-config-provider>
</template>

<script setup>
import { NConfigProvider, darkTheme, lightTheme, NButton, NSwitch } from 'naive-ui'
import { ref } from 'vue'
import { NGradientPicker } from 'naive-gradient-picker'


const darkMode = ref(false);

const gradient1 = ref(`linear-gradient(to right, blue, green, #000)`);

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  width: 100%;

}
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}
.root {
  height: 100%;
  width: 100%;
  > header {
    padding: 20px 0;
  }
  > main {
    padding: 20px 0;
    max-width: 200px;
    margin: auto;
  }
}
.theme-dark {
  background-color: #333;
}
.theme-light {
  background-color: rgb(250, 250, 250);
}
</style>
