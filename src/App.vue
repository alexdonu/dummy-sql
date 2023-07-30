<script setup lang="ts">
import { ref } from "vue";
import QueryEditor from "./components/QueryEditor.vue";
import QueryResult from "./components/QueryResult.vue";
import DatabaseTables from "./components/DatabaseTables.vue";
import { useQuery } from "./composables/useQuery";

const queryResultKey = ref(0);
const editor = ref<null | { runQuery(query: string): void }>(null);

const { parseQuery, queryInfo, table, errorMessage } = useQuery();

function executeQuery(query: string) {
  parseQuery(query);
  queryResultKey.value++;
}

function selectTable(tableName: string) {
  editor.value?.runQuery(`select * from ${tableName}`);
}
</script>

<template>
  <div class="container">
    <div class="sql-box">
      <QueryEditor ref="editor" @execute="executeQuery" />
      <QueryResult
        v-if="queryInfo && table"
        :key="queryResultKey"
        :columns="queryInfo.columns"
        :data="table"
      />
      <div v-else>
        {{ errorMessage }}
      </div>
    </div>
    <DatabaseTables @select="selectTable" />
  </div>
</template>

<style scoped>
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
</style>
