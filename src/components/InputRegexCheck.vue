<template>
  <input type="text" v-model="valueInner" v-on:keypress="checkValidity" v-on:input="propagateInput">
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({})
  export default class InputRegexCheck extends Vue {
    @Prop(String) regex: string | undefined;
    @Prop(String) value: string | undefined;
    private valueInner: string;

    public static nameRegex = "^[a-zA-Z_]+[a-zA-Z0-9_]*$";

    constructor() {
      super();
      this.valueInner = this.value || "";
    }

    checkValidity(event: KeyboardEvent) {
      const newValue = event.key || "";
      if (this.regex && newValue && !(this.valueInner + newValue).match(this.regex)) {
        event.preventDefault();
      } else {
        console.log("OK");
        this.$emit('input', this.valueInner + newValue);
      }
    }

    propagateInput(event: any) {
      this.$emit('input', this.valueInner);
    }
  }
</script>

<style scoped>

</style>