<template>
  <div id="app">
    <router-view />
    <loading
      :active.sync="showLoader"
      :is-full-page="true"
      :width="150"
      :height="150"
      :background-color="'#0f1015'"
      :opacity="1"
      :color="'white'"
    ></loading>
  </div>
</template>
<script>
import { mapState } from 'vuex';

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  components: {
    Loading,
  },
  computed: {
    ...mapState(['showLoader']),
  },
};
</script>

<style lang="scss"></style>
