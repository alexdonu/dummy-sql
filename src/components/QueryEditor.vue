<script lang="ts" setup>
import { ref } from "vue";

const emit = defineEmits<{
  (event: "execute", query: string): void;
}>();

const query = ref("select * from users order by username");

function runQuery(queryValue: string) {
  query.value = queryValue;
  emit("execute", queryValue);
}

defineExpose({
  runQuery,
});
</script>

<template>
  <div>
    <h1>SQL Statement:</h1>
    <div class="centered-box">
      <div class="monaco">
        <vue-monaco-editor v-model:value="query" theme="light" language="sql" />
      </div>
    </div>
    <h3>Edit the SQL Statement, and click "Run SQL" to see the result.</h3>
    <button @click="emit('execute', query)" class="button">Run SQL »</button>
  </div>
</template>

<style scoped>
.centered-box {
  display: flex;
  justify-content: center;
}

.monaco {
  width: 100%;
  height: 150px;
  background-color: white;
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
</style>
