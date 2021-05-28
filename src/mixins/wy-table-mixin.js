/*
 * @Description wy-form-table mixin
 * @Author wangjun
 * @Date 2021-03-08 11:11:21
 */
export default {
  computed: {},
  methods: {
    indexMethod(index) {
      const { pagination } = this.$refs.wyTableRef;
      return pagination.pageSize * (pagination.pageNumber - 1) + index + 1;
    },
  },
};
