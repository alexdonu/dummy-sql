<script lang="ts" setup>
import { useDatabase } from "../composables/useDatabase";

const emit = defineEmits<{
  (event: "select", tableName: string): void;
}>();

const { databaseInfo } = useDatabase();
</script>

<template>
  <div class="db-box">
    <h3>AlexSQL Database:</h3>
    <div class="db-rows">
      <div class="db-row">
        <h4>Tablenames</h4>
        <h4>Records</h4>
      </div>
      <div v-for="tableInfo in databaseInfo" class="db-row">
        <ins>
          <h5 @click="emit('select', tableInfo.name)">{{ tableInfo.name }}</h5>
        </ins>
        <h5>{{ tableInfo.size }}</h5>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
</style>
