import { computed } from "vue";
import { db } from "../data/db";

export function useDatabase() {
  const databaseInfo = computed(() =>
    Object.entries(db).map(([key, value]) => ({
      name: key,
      size: value.length,
    }))
  );

  return { databaseInfo };
}
