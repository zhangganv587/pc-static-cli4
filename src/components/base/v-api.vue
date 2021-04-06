<!--
 * @Author: zhanggan
 * @Date: 2020-12-02 17:26:15
 * @LastEditors: zhanggan
 * @Description: api切换
 * @FilePath: /pc-static-cli4/src/components/base/v-api.vue
-->
<template>
  <div class="v-api">
    <div
      v-show="selectShown !== 'production'"
      class="gpay-api"
      @click="dialogVisible = true"
    >
      api
    </div>
    <el-dialog
      title="api切换"
      :visible.sync="dialogVisible"
      width="400px"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="api:">
          <el-select v-model="form.baseUrlApi" placeholder="请选择api">
            <el-option
              v-for="api in apiOptions"
              :key="api.value"
              :label="api.label"
              :value="api.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button type="primary" size="mini" @click="handSubmit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Config from "@/config";

export default {
  name: "Api",
  props: {},
  data() {
    this.apiOptions = [
      { label: "newapi", value: "newapi" },
      { label: "newapi2", value: "newapi2" },
      { label: "newapi3", value: "newapi3" },
      { label: "newapi4", value: "newapi4" },
      { label: "newapi5", value: "newapi5" },
      { label: "newapi6", value: "newapi6" },
      { label: "newapi7", value: "newapi7" },
    ];
    return {
      dialogVisible: false,
      selectShown: "dev",
      form: {
        baseUrlApi: "/newapi",
      },
    };
  },
  mounted() {
    this.selectShown = process.env.VUE_APP_CURRENTMODE;
    console.log(this.selectShown, "selectShown");
    const apiPath = sessionStorage.getItem("apiPath");
    this.form.baseUrlApi = apiPath
      ? apiPath.split("/")[3]
        ? `${apiPath.split("/")[3]}`
        : `${apiPath.split("/")[2]}`
      : "newapi";
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    handSubmit() {
      const apiPath = `${Config.API_URL}${this.form.baseUrlApi}`;
      sessionStorage.setItem("apiPath", apiPath);
      this.handleClose();
      // 通过微任务让数据处理完后刷新
      Promise.resolve().then(location.reload());
    },
  },
};
</script>
<style lang="less" scoped>
.gpay-api {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 120;
  width: 40px;
  height: 40px;
  font-size: 13px;
  line-height: 40px;
  color: white;
  text-align: center;
  cursor: pointer;
  background: #38f;
  border-radius: 50%;
  box-shadow: 2px 3px 5px #999;
}
</style>
