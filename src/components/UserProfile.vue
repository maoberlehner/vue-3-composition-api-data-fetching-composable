<template>
  <div>
    <h2>Profile</h2>
    <template v-if="user">
      {{ user }}
    </template>
    <template v-else-if="state === STATE.loading">
      LOADING ...
    </template>
    <template v-else-if="state === STATE.error">
      {{ error }}
    </template>
    <template v-if="state === STATE.revalidating">
      <small>revalidating ...</small>
    </template>
  </div>
</template>

<script>
import { fetcher } from '../utils/fetcher';
import { useSwrCache, STATE } from '../composables/swr-cache';

export default {
  name: `UserProfile`,
  setup() {
    const {
      data: user,
      error,
      state,
    } = useSwrCache(`https://jsonplaceholder.typicode.com/users/1`, fetcher);

    return {
      STATE,
      error,
      state,
      user,
    };
  },
};
</script>
