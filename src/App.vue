<template>
  <div
    id="app"
    class="m-6 max-w-2xl mx-auto"
  >
    <UserAvatar/>
    <UserProfile
      v-for="profile in profiles"
      :key="profile"
      class="mt-12"
    />
    <div class="mt-8">
      <button
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700 transition duration-150 ease-in-out mr-4"
        @click="profiles.push"
      >
        Add profile
      </button>
      <button
        :disabled="state === STATE.revalidating"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700 transition duration-150 ease-in-out"
        :class="state === STATE.revalidating && `opacity-25`"
        @click="reload"
      >
        {{ state === STATE.revalidating ? `Revalidating ...` : `Load new data` }}
      </button>
    </div>
  </div>
</template>

<script>
import { fetcher } from './utils/fetcher';
import { STATE, useSwrCache } from './composables/swr-cache';

import UserAvatar from './components/UserAvatar.vue';
import UserProfile from './components/UserProfile.vue';

export default {
  name: `App`,
  components: {
    UserAvatar,
    UserProfile,
  },
  data() {
    return { profiles: [``] };
  },
  setup() {
    const { reload, state } = useSwrCache(`/users/1`, fetcher);

    return { STATE, reload, state };
  },
};
</script>
