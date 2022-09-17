<template>
  <div
    class="common-table d-flex flex-column justify-start"
    :class="{ scroll: props.scroll }"
  >
    <table>
      <!-- 헤더 -->
      <thead>
        <tr>
          <template v-for="(column, key) in columnSpecs" :key="key">
            <th
              :style="{
                marginLeft: 'auto',
                marginRight: 'auto',
                width: column.width ? column.width : '',
                maxWidth: column.maxWidth ? column.maxWidth : '',
                whiteSpace: 'nowrap',
                color: column.color,
              }"
            >
              <div class="d-flex">
                <div class="mr-2" v-html="column.header" />
                <div
                  class="d-flex flex-column justify-center"
                  v-if="column?.sortable"
                >
                  <SvgBtn
                    width="10"
                    height="10"
                    viewBox="0 0 8 8"
                    :color="
                      column?.dataKey === orderKey && orderCondition === 'asc'
                        ? '#212121'
                        : '#9E9E9E'
                    "
                    @click="
                      () =>
                        onClickHeaderSortBtn(
                          column?.dataKey ? column?.dataKey : '',
                          'asc'
                        )
                    "
                  >
                    <SortAsc />
                  </SvgBtn>

                  <SvgBtn
                    width="10"
                    height="10"
                    viewBox="0 0 8 8"
                    :color="
                      column.dataKey === orderKey && orderCondition === 'desc'
                        ? '#212121'
                        : '#9E9E9E'
                    "
                    @click="
                      () =>
                        onClickHeaderSortBtn(
                          column.dataKey ? column.dataKey : '',
                          'desc'
                        )
                    "
                  >
                    <SortDesc />
                  </SvgBtn>
                </div>
              </div>
            </th>
          </template>
        </tr>
      </thead>
    </table>

    <div class="table-body">
      <table>
        <tbody>
          <!-- 행 -->
          <tr
            v-for="(row, i) in modelValue"
            :style="{
              position: 'relative',
              cursor: link ? 'pointer' : '',
              backgroundColor: isHover[i] ? rowHoverBgColor : '',
            }"
            :key="row"
            @mouseenter="isHover[i] = true"
            @mouseleave="isHover[i] = false"
            @click="() => onClickTr(row)"
          >
            <td
              v-for="(column, j) in columnSpecs"
              :key="j"
              :style="{
                width: column.width ? column.width : '',
                maxWidth: column.maxWidth ? column.maxWidth : '',
              }"
            >
              <div class="d-flex align-center" style="position: relative">
                <!-- 텍스트 -->
                <span
                  class="mr-2"
                  :style="{
                    maxWidth: column.maxWidth ? column.maxWidth : 'max-content',
                    color: column?.color ? column?.color : 'black',
                    fontSize: column?.fontSize ? column?.fontSize : '0.875rem',
                    fontWeight: column?.fontWeight ? column?.fontWeight : 400,
                    padding: column?.padding ? column?.padding : '',
                    borderRadius: column?.borderRadius
                      ? column?.borderRadius
                      : '',
                    backgroundColor:
                      typeof column?.backgroundColor === 'object'
                        ? column?.backgroundColor[
                            row[column.backgroundColorKey as string] as string & number
                          ]
                        : column?.backgroundColor
                        ? column?.backgroundColor
                        : '',
                    cursor: column?.cursor ? column?.cursor : '',
                    whiteSpace: column?.whiteSpace
                  }"
                  @click="
                    {
                      // 특별히 지정된 함수가 없고, 커서가 pointer로 지정된 경우에만 실행
                      if (!column?.funcType && column?.cursor) onClickTd(row);
                      // 특별히 지정된 함수가 있고, 커서가 pointer로 지정된 경우에만 실행
                      else if (column?.funcType && column?.cursor)
                        onClickCustomBtn(column?.funcType, row);
                    }
                  "
                  v-html="row[column?.dataKey as string]"
                >
                </span>
                <!-- 로컬 / 클라우드 아이콘 -->
                <div
                  class="d-flex align-center justify-center"
                  style="width: 1.3125rem; height: 1.3125rem"
                >
                  <v-icon
                    v-if="
                      column?.dataKey?.includes('title') &&
                      row?.save_location_icon_obj
                    "
                    class="mt-1"
                    :icon="row?.save_location_icon_obj?.icon"
                    :color="row?.save_location_icon_obj?.color"
                  />
                </div>
                <!-- 호버 버튼 -->
                <div
                  v-if="isHover[i]"
                  class="common-table-tr-hover-buttons-box d-flex align-center"
                >
                  <!-- 호버 배경색 주는 언더레이 -->
                  <!-- {{ rowHoverBgColor }}
                  {{ isHover[i] }} -->
                  <div
                    v-show="column.hoverButtons?.length"
                    class="common-table-tr-hover-buttons-box-underlay"
                    :style="{
                      backgroundColor: isHover[i]
                        ? rowHoverBgColor
                        : themeStore.darkmodeBackgroundColor,
                    }"
                  />
                  <template
                    v-for="(item, idx) in column?.hoverButtons"
                    :key="idx"
                  >
                    <template
                      v-if="!item.visible || item.visible(row[column.hoverButtonKey as string] as string)"
                    >
                      <IconBtn
                        v-if="item?.icon"
                        class="table-icon"
                        :style="[
                          item,
                          {
                            cursor: 'pointer',
                            '--color-hover': item?.hoverColor,
                          },
                        ]"
                        :key="idx"
                        :icon="item?.icon"
                        @click="
                          onClickCustomBtn(
                            item?.funcType ? item?.funcType : '',
                            row
                          )
                        "
                      />
                      <div
                        class="d-flex align-center justify-center"
                        :class="{
                          'mr-2': idx !== column?.hoverButtons?.length - 1,
                        }"
                        :style="[
                          item,
                          {
                            position: 'relative',
                            whiteSpace: 'nowrap',
                          },
                        ]"
                        @click="
                          onClickCustomBtn(
                            item?.funcType ? item?.funcType : '',
                            row
                          )
                        "
                      >
                        {{ item?.text }}
                      </div>
                    </template>
                  </template>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      v-if="isLoading"
      class="table-body d-flex justify-center align-center"
      style="position: absolute; width: 100%; height: 100%; background: white"
    >
      <v-progress-circular indeterminate color="#5c6bc0" width="7" :size="50" />
    </div>
  </div>
</template>

<script setup lang="ts">
import IconBtn from "@/components/common/IconBtn.vue";
import useAppStore from "@/store/useAppStore";
import type { TableColumnSpecType } from "@/types/table";
import { onMounted, ref, watch } from "vue";
import SortAsc from "@/assets/svgs/sortAsc.vue";
import SortDesc from "@/assets/svgs/sortDesc.vue";
import SvgBtn from "@/components/common/SvgBtn.vue";
import useThemeStore from "@/store/useThemeStore";

// props 데이터 없을 때 초기값 설정
const props = withDefaults(
  defineProps<{
    modelValue?: any[];
    columnSpecs?: TableColumnSpecType[];
    orderKey?: string;
    orderCondition?: string;
    link?: boolean;
    vertical?: boolean;
    borderColor?: string;
    rowHoverBgColor?: string;
    scroll?: boolean;
    buttons?: object[];
    emptyStr?: string;
    isLoading?: boolean;
  }>(),
  {
    borderColor: "#e0e0e0",
  }
);

// emits
const emit = defineEmits<{
  (e: "clickTd", item: any): void;
  (e: "clickTr", item: any): void;
  (e: "clickBtn", data: { type: string; item: any }): void;
  (e: "update:modelValue", modelValue: any): void;
  (e: "clickOrder", item: any): void;
}>();

const isHover = ref<boolean[]>([]);

const appStore = useAppStore();
const themeStore = useThemeStore();

const commonTableClass = ref("");
if (props.vertical) commonTableClass.value += " vertical";

const items = ref(props.modelValue);

// 테이블 로우 클릭했을 때 동작
const onClickTr = (item: any) => {
  emit("clickTr", item);
};

// 텍스트 클릭했을 때 --> 커서가 포인터로 지정된 애들한테만 동작하도록 설정함
const onClickTd = (item: any) => {
  emit("clickTd", item);
};

// 버튼 클릭했을 때
const onClickCustomBtn = (type: string, item: any) => {
  console.log(type, item);
  if (type !== "") {
    appStore.caseManagementFunction = type;
    appStore.caseManagementLocation = "table";
    appStore.caseManagementData = item;
  }
  emit("clickBtn", { type, item });
};

function onClickHeaderSortBtn(key: string, order: string) {
  emit("clickOrder", { key: key, order: order });
}

watch(items, (newValue) => {
  emit("update:modelValue", newValue);
});

onMounted(() => {
  console.log("table mounted");
});
</script>
<style lang="scss">
.table-icon {
  &:hover {
    background-color: var(--color-hover);
  }
}
.common-table {
  position: relative;
  width: 100%;
  height: 100%;
  table {
    table-layout: fixed;
    width: 100%;
    border: 0rem;
    border-collapse: collapse;
    transition: all 0.1s;
  }
  &.scroll {
    .table-body {
      overflow: overlay;
    }
  }

  th {
    z-index: 1;
    padding: 0.625rem 0.625rem;
    position: sticky;
    top: 0;
    text-align: start;
    color: #7c7f90;
    border-bottom: 0.0625rem solid #eeeeee;
    font-size: 0.875rem;
    font-weight: 400;
  }
  td {
    position: relative;
    padding: 0.625rem 0.625rem;
    font-size: 0.875rem;
    font-weight: 400;
  }
  tr {
    height: 2.3125rem;
    border-bottom: 0.0625rem solid #eeeeee;
    word-break: break-all;
    font-weight: 400;
    .common-table-tr-hover-buttons-box {
      flex: 1;
      position: absolute;
      right: 0;
      border-radius: 4px;
      background-color: white;
    }
    .common-table-tr-hover-buttons-box-underlay {
      flex: 1;
      width: 100%;
      height: 100%;
      padding: 8px;
      position: absolute;
      right: 0;
      border-radius: 4px;
    }
  }
  &.vertical {
    table {
      border-collapse: collapse;
      display: flex;
      flex-direction: row;
      thead {
        display: flex;
        flex-direction: column;
      }
      tbody {
        display: flex;
      }
      tr {
        display: block;
        border-bottom: #e0e0e0;
      }
      td {
        display: block;
        border-bottom: 0.0625rem solid #eeeeee;
      }
    }
  }
}
</style>
