<script setup lang="ts">
import { db, QUERY_INFO } from "./data/db";
import { Parser } from "node-sql-parser";
import { computed, ref } from "vue";
import { RecycleScroller } from "vue-virtual-scroller";

const query = ref(`--select * from users
--select * from employees
--select userId from employees
--select userId, username from employees
--select username, password from users
select * from users order by username`);

const parser = new Parser();

const scrollerKey = ref(0);
const queryInfo = ref<QUERY_INFO | null>(null);
const errorMessage = ref("");
const table = computed(() =>
  queryInfo.value == null ? null : getTable(queryInfo.value)
);

const CELL_WIDTH = 300;
const ROW_PADDING = 10;
const rowWidth = computed(
  () => CELL_WIDTH * (queryInfo.value?.columns.length ?? 0) + ROW_PADDING * 2
);
const cssCellWidth = computed(() => `${CELL_WIDTH}px`);
const cssRowPadding = computed(() => `${ROW_PADDING}px`);
const cssRowWidth = computed(() => `${rowWidth.value}px`);

function getTable(queryInfo: QUERY_INFO | null) {
  const table = queryInfo
    ? queryInfo.tableName in db
      ? [...db[queryInfo.tableName as keyof typeof db]]
      : null
    : null;

  if (table != null && queryInfo != null && queryInfo.orderBy != null) {
    if (queryInfo.orderBy.type === "ASC") {
      return table.sort(function (a, b) {
        return a[queryInfo.orderBy!.column as keyof typeof a] >
          b[queryInfo.orderBy!.column as keyof typeof b]
          ? 1
          : a[queryInfo.orderBy!.column as keyof typeof a] <
            b[queryInfo.orderBy!.column as keyof typeof b]
          ? -1
          : 0;
      });
    } else if (queryInfo.orderBy.type === "DESC") {
      const cached = table.sort(function (a, b) {
        return a[queryInfo.orderBy!.column as keyof typeof a] <
          b[queryInfo.orderBy!.column as keyof typeof b]
          ? 1
          : a[queryInfo.orderBy!.column as keyof typeof a] >
            b[queryInfo.orderBy!.column as keyof typeof b]
          ? -1
          : 0;
      });
      return cached;
    }
  } else {
    return table;
  }
}

function showTable(tableName: string) {
  query.value = `select * from ${tableName}`;
}

function parseQuery() {
  errorMessage.value = "";
  queryInfo.value = null;
  try {
    const ast = parser.astify(query.value);

    if (Array.isArray(ast)) {
      throw new Error("Please, write only 1 query!");
    }

    if (ast.type !== "select") {
      throw new Error("Type of query must be SELECT!");
    }

    if (ast.from == null) {
      throw new Error("Please specify from!");
    }

    if (!(ast.from[0].table in db)) {
      throw new Error(`Unknown table`);
    }

    const tableName = ast.from[0].table as keyof typeof db;
    const columnNames = Object.keys(db[tableName][0]);

    if (Array.isArray(ast.columns)) {
      ast.columns.forEach((element) => {
        if (!columnNames.includes(element.expr.column)) {
          throw new Error(`Field "${element.expr.column}" does not exist!`);
        }
      });
    }

    queryInfo.value = {
      columns:
        ast.columns === "*"
          ? columnNames
          : ast.columns.map((el) => el.expr.column),
      tableName: ast.from[0].table,
      orderBy: Array.isArray(ast.orderby)
        ? { type: ast.orderby[0].type, column: ast.orderby[0].expr.column }
        : null,
    };

    scrollerKey.value++;
  } catch (error) {
    errorMessage.value =
      error instanceof Error ? error.message : "Unknown error";
  }
}
</script>

<template>
  <div class="container">
    <div class="sql-box">
      <div class="editor">
        <h1>SQL Statement:</h1>
        <div class="centered-box">
          <div class="monaco">
            <vue-monaco-editor
              v-model:value="query"
              theme="light"
              language="sql"
            />
          </div>
        </div>
        <h3>Edit the SQL Statement, and click "Run SQL" to see the result.</h3>
        <button @click="parseQuery" class="button">Run SQL »</button>
      </div>
      <div class="result">
        <h2>Result:</h2>
        <div class="centered-box">
          <div class="result-box">
            <div v-if="queryInfo" class="result-container">
              <div class="tablerow heading-row">
                <div
                  v-for="field in queryInfo.columns"
                  :key="field"
                  class="tablecell"
                >
                  <ins>{{ field }}</ins>
                </div>
              </div>

              <RecycleScroller
                :key="scrollerKey"
                class="scroller"
                :items="table"
                :item-size="40"
                key-field="userId"
              >
                <template v-slot="{ item }">
                  <div class="tablerow" :key="item.userId">
                    <div
                      v-for="field in queryInfo.columns"
                      :key="field"
                      class="tablecell"
                    >
                      {{ item[field as keyof typeof item] }}
                    </div>
                  </div>
                </template>
              </RecycleScroller>
            </div>
            <div v-else>{{ errorMessage }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="db-box">
      <h3>AlexSQL Database:</h3>
      <div class="db-rows">
        <div class="db-row">
          <h4>Tablenames</h4>
          <h4>Records</h4>
        </div>
        <div v-for="tableName in Object.keys(db)" class="db-row">
          <ins
            ><h5 @click="showTable(tableName)">{{ tableName }}</h5></ins
          >
          <h5>{{ db[tableName as keyof typeof db].length }}</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scroller {
  flex: 1 0 0;
  width: v-bind(cssRowWidth);
}

.user {
  height: 32%;
  padding: 0 12px;
  display: flex;
  align-items: center;
}
.tablerow {
  display: flex;
  padding: v-bind(cssRowPadding);
  width: v-bind(cssRowWidth);
  flex-grow: 0;
  flex-shrink: 0;
}
.tablehead {
  background-color: beige;
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

.container {
  display: flex;
  margin: 24px;
  justify-content: space-between;
  gap: 24px;
}

.sql-box {
  background-color: rgb(231, 231, 231);
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  max-width: calc(100% - 264px);
}

.sql-box > * {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.centered-box {
  display: flex;
  justify-content: center;
}
.monaco {
  width: 100%;
  height: 150px;
  background-color: white;
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

.db-box {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.db-rows {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.db-row {
  display: flex;
  justify-content: space-between;
  height: 20px;
}

.button {
  border: none;
  border-radius: 10px;
  color: white;
  background-color: #4caf50;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  flex-grow: 0;
  align-self: baseline;
}

h1,
h2,
h3,
h5 {
  font-weight: normal;
}

h5:hover {
  cursor: pointer;
}
</style>
