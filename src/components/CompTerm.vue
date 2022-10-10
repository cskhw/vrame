<template>
  <div class="term">
    <div style="position: absolute" v-on:click="activeDropdown = false"></div>
    <div class="term__container container">
      <h1>{{ title }}</h1>
      <div
        class="navbar-item has-dropdown is-hoverable"
        v-on:click="activeDropdown = !activeDropdown"
        v-bind:class="{ 'is-active': activeDropdown }"
      >
        <a class="navbar-link"> {{ date }} </a>
        <div
          class="navbar-dropdown"
          :style="[!activeDropdown && { display: 'none' }]"
        >
          <a
            class="navbar-item"
            style="margin-bottom: 0.625rem; border: none"
            v-for="item in arrSelect"
            :key="item"
            v-on:click="selectItem(item)"
          >
            <p>{{ item }}</p>
          </a>
        </div>
      </div>

      <!-- cotaine 1 -->
      <div class="rule-containe">
        <h3>{{ rule1 }}</h3>
        <p>
          {{ content1 }}
        </p>
      </div>

      <!-- cotaine 2 -->
      <div class="rule-containe">
        <h3>{{ rule2 }}</h3>
        <p>
          {{ content2 }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/styles/term_outsourcing.scss";
</style>

<script>
export default {
  data() {
    return { activeDropdown: false, date: "2021.05.1" };
  },
  props: {
    title: String,
    arrSelect: Array,
    rule1: String,
    content1: String,
    rule2: String,
    content2: String,
  },
  components: {},
  methods: {
    selectItem: function (item) {
      this.date = item;
    },
  },
};
</script>
