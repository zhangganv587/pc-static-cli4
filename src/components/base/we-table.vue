// my-table.vue
<template>
  <main>
    <el-table
      ref="elTable"
      :data="data.tableData"
      v-bind="$attrs"
      v-on="$listeners"
    >
      <template v-for="(colConfig, index) in colConfigs">
        <slot v-if="colConfig.slot" :name="colConfig.slot" />
        <component
          :is="colConfig.component"
          v-else-if="colConfig.component"
          :key="index"
          :col-config="colConfig"
        />
        <el-table-column v-else :key="index" v-bind="colConfig" />
      </template>
    </el-table>
    <we-pagination
      :total="data.totalSize"
      :current-page="data.pageNum"
      :page-size="data.pageSize"
      :current-change="currentChange"
    />
  </main>
</template>

<script>
export default {
  props: {
    colConfigs: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    this.tableMethods = [
      "clearSelection",
      "toggleRowSelection",
      "toggleAllSelection",
      "toggleRowExpansion",
      "setCurrentRow",
      "clearSort",
      "clearFilter",
      "doLayout",
      "sort",
    ];
    return {};
  },
  created() {},
  mounted() {
    this.tableMethods.forEach((element) => {
      this.$on(element, this.$refs.elTable[element]);
    });
  },
  methods: {
    currentChange(data) {
      this.$emit("currentChange", data);
    },
  },
};
</script>
