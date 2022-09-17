<template>
  <div class="common-list">
    <v-container class="pa-0">
      <v-list class="pa-0">
        <h1 class="ml-5">{{ title }}</h1>
        <v-divider />
        <v-list-item>
          <v-list-item-title
            class="mx-3"
            v-for="(value, name) in localItems[0]"
            :key="name"
            >{{ name }}<v-divider vertical />
          </v-list-item-title>
        </v-list-item>
        <v-divider />
        <v-table> </v-table>
        <v-container
          :class="index % 2 == 0 ? 'bg-grey-lighten-2 pl-2 pa-0' : 'pl-2 pa-0'"
          v-for="(item, index) of localItems"
          :key="item"
        >
          <v-list-item>
            <p />
            <v-list-item-title
              class="mx-3"
              v-for="(value, name) in item"
              :key="name"
              >{{ value }} <v-divider
            /></v-list-item-title>
          </v-list-item>
          <v-divider />
        </v-container>
      </v-list>
    </v-container>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  items: object[];
}

const props = withDefaults(defineProps<Props>(), {
  title: "title",
  items: () => [{ title: "목록이 없습니다." }],
});
const localItems = ref(props.items);
</script>

<style lang="scss">
.common-list {
  background-color: white;
  box-shadow: 0rem 0.0625rem 0.1875rem grey;
  &:hover {
    cursor: pointer;
    background-color: darken(white, 1%);
  }
}
</style>
