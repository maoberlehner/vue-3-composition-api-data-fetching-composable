<template>
  <div>
    <div
      v-if="user"
      class="flex items-center"
    >
      <div class="flex-shrink-0 h-10 w-10">
        <img
          class="h-10 w-10 rounded-full"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=facearea&amp;facepad=2&amp;w=256&amp;h=256&amp;q=80"
          :alt="user.name"
        >
      </div>
      <div class="ml-4">
        <div class="text-sm leading-5 font-medium text-gray-900">{{ user.name }}</div>
        <div class="text-sm leading-5 text-gray-500">{{ user.email }}</div>
      </div>
    </div>
    <template v-else-if="state === STATE.loading">
      LOADING ...
    </template>
    <template v-else-if="state === STATE.error">
      {{ error }}
    </template>
  </div>
</template>

<script>
import { fetcher } from '../utils/fetcher';
import { useSwrCache, STATE } from '../composables/swr-cache';

export default {
  name: `UserAvatar`,
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
