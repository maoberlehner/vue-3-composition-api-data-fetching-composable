<template>
  <div>
    <div
      v-if="user"
      class="bg-white shadow overflow-hidden sm:rounded-lg"
    >
      <div class="px-4 py-5 border-b border-gray-200 sm:px-6">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Profile
            </h3>
            <p class="mt-1 max-w-2xl text-sm leading-5 text-gray-500">
              Personal details.
            </p>
          </div>
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
      <div>
        <dl>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Full name
            </dt>
            <dd class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
              {{ user.name }}
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Email
            </dt>
            <dd class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
              {{ user.email }}
            </dd>
          </div>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Website
            </dt>
            <dd class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
              {{ user.website }}
            </dd>
          </div>
          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm leading-5 font-medium text-gray-500">
              Company
            </dt>
            <dd class="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">
              {{ user.company.name }}
            </dd>
          </div>
        </dl>
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
  name: `UserProfile`,
  setup() {
    const {
      data: user,
      error,
      reload,
      state,
    } = useSwrCache(`/users/1`, fetcher);

    return {
      STATE,
      error,
      reload,
      state,
      user,
    };
  },
};
</script>
