<template>
  <div class="home">
    <h1>Home Page</h1>
    <p>Welcome to the Home Page!</p>
    <div class="counter-example">
      <h2>Pinia Counter Example</h2>
      <p>Count: {{ counterStore.count }}</p>
      <p>Double Count: {{ counterStore.doubleCount }}</p>
      <button @click="counterStore.increment">Increment</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '../store/counter'

const counterStore = useCounterStore()
</script>

<style scoped>
.home {
  padding: 20px;
}
.counter-example {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #3aa876;
}
</style>
