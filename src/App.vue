<template>
  <div id="app">
    <UserAvatar/>
    <UserProfile/>
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
