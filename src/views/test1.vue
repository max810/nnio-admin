<template>
  <div>
    {{t}}|
    <test1 v-bind:t="t - 1" v-if="t > 0">

    </test1>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({})
  export default class test1 extends Vue {
    @Prop(Number) t: number | undefined;
    name: string = "test1";
  }
</script>

<style scoped>

</style>