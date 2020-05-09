<template>
  <div
    id="app"
    class="m-6 max-w-4xl mx-auto"
  >
    <UserAvatar/>
    <UserProfile class="mt-12"/>
  </div>
</template>

<script>
import UserAvatar from './components/UserAvatar.vue';
import UserProfile from './components/UserProfile.vue';

export default {
  name: `App`,
  components: {
    UserAvatar,
    UserProfile,
  },
};
</script>
