<script lang="ts" setup>
// @ts-ignore
import { RecycleScroller } from "vue-virtual-scroller";
import { computed } from "vue";

const props = defineProps<{
  columns: string[];
  data: Record<string, string>[];
}>();

const CELL_WIDTH = 300;
const ROW_PADDING = 10;
const rowWidth = computed(
  () => CELL_WIDTH * props.columns.length + ROW_PADDING * 2
);
const cssCellWidth = computed(() => `${CELL_WIDTH}px`);
const cssRowPadding = computed(() => `${ROW_PADDING}px`);
const cssRowWidth = computed(() => `${rowWidth.value}px`);
</script>

<template>
  <div class="result">
    <h2>Result:</h2>
    <div class="centered-box">
      <div class="result-box">
        <div class="result-container">
          <div class="tablerow heading-row">
            <div v-for="field in props.columns" :key="field" class="tablecell">
              <ins>{{ field }}</ins>
            </div>
          </div>

          <RecycleScroller
            class="scroller"
            :items="props.data"
            :item-size="40"
            key-field="userId"
          >
            <template v-slot="{ item }">
              <div class="tablerow" :key="item.userId">
                <div
                  v-for="field in props.columns"
                  :key="field"
                  class="tablecell"
                >
                  {{ item[field] }}
                </div>
              </div>
            </template>
          </RecycleScroller>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.centered-box {
  display: flex;
  justify-content: center;
}

.result-box {
  width: 100%;
  height: 450px;
  background-color: white;
  border: 2px solid rgb(128, 108, 108);
}

.result-container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.tablerow {
  display: flex;
  padding: v-bind(cssRowPadding);
  width: v-bind(cssRowWidth);
  flex-grow: 0;
  flex-shrink: 0;
}

.heading-row {
  flex: 0 0 0;
}

.tablecell {
  width: v-bind(cssCellWidth);
  flex-shrink: 0;
  line-height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 16px;
}

.scroller {
  flex: 1 0 0;
  width: v-bind(cssRowWidth);
}
</style>
