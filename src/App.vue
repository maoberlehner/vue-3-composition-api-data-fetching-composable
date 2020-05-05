<template>
  <div id="app">
    Hello World
    Data: {{ data }}<br>
    Error: {{ error }}<br>
    State: {{ state }}<br>
    <button @click="reload">
      Reload
    </button>
  </div>
</template>

<script>
import { useSwrCache } from './composables/swr-cache';

const fetcher = endpoint => fetch(endpoint).then(response => response.json());

export default {
  name: `App`,
  setup() {
    const {
      data,
      error,
      reload,
      state,
    } = useSwrCache(`https://jsonplaceholder.typicode.com/users/1`, fetcher);

    return {
      data,
      error,
      reload,
      state,
    };
  },
};
</script>
