import { computed, ref } from "vue";
import { QUERY_INFO, db } from "../data/db";
import { Parser } from "node-sql-parser";

const parser = new Parser();

export function useQuery() {
  const queryInfo = ref<QUERY_INFO | null>(null);
  const errorMessage = ref("");
  const table = computed(() => {
    if (queryInfo.value == null) {
      return null;
    }

    const table = queryInfo.value
      ? queryInfo.value.tableName in db
        ? [...db[queryInfo.value.tableName as keyof typeof db]]
        : null
      : null;

    if (
      table != null &&
      queryInfo.value != null &&
      queryInfo.value.orderBy != null
    ) {
      if (queryInfo.value.orderBy.type === "ASC") {
        return table.sort(function (a, b) {
          return a[queryInfo.value!.orderBy!.column as keyof typeof a] >
            b[queryInfo.value!.orderBy!.column as keyof typeof b]
            ? 1
            : a[queryInfo.value!.orderBy!.column as keyof typeof a] <
              b[queryInfo.value!.orderBy!.column as keyof typeof b]
            ? -1
            : 0;
        });
      } else if (queryInfo.value.orderBy.type === "DESC") {
        const cached = table.sort(function (a, b) {
          return a[queryInfo.value!.orderBy!.column as keyof typeof a] <
            b[queryInfo.value!.orderBy!.column as keyof typeof b]
            ? 1
            : a[queryInfo.value!.orderBy!.column as keyof typeof a] >
              b[queryInfo.value!.orderBy!.column as keyof typeof b]
            ? -1
            : 0;
        });
        return cached;
      }
    } else {
      return table;
    }
  });

  function parseQuery(query: string) {
    errorMessage.value = "";
    queryInfo.value = null;
    try {
      const ast = parser.astify(query);

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
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : "Unknown error";
    }
  }

  return {
    queryInfo,
    table,
    errorMessage,
    parseQuery,
  };
}
