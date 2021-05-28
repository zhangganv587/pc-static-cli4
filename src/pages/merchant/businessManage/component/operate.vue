<!--
 * @Author: 张淦
 * @Date: 2019-12-09 16:59:16
 * @LastEditors: zhanggan
 * @Description: 商户2.0
 * @FilePath: /gpay-ops-static/src/pages/merchant/businessManage/component/operate.vue
 -->
<template>
  <div class="pay-operate">
    <v-form-card
      title="默认支付方式与支付排序"
      :button="methodButton"
      @handleSave="saveSort"
      @handleEdit="editSort"
    >
      <el-table :data="tableData" row-key="id">
        <el-table-column prop="icon" label="排序" width="52">
          <template>
            <img :src="require('../../../../assets/images/list-more.png')" />
          </template>
        </el-table-column>
        <el-table-column prop="default" label="默认支付方式" width="108">
          <template slot-scope="scope">
            <el-radio
              v-model="templateRadio"
              :label="scope.row.payWayCode"
              :disabled="sortStyle"
            >
              &nbsp;
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="payWayName" label="支付方式" />
      </el-table>
    </v-form-card>
    <v-form-card
      title="支付结果跳转"
      :button="targetButton"
      @handleSave="saveTarget"
      @handleEdit="editTarget"
    >
      <el-form
        ref="mylink"
        :model="targetForm"
        label-width="150px"
        :rules="rules"
      >
        <el-form-item label="支付成功跳转链接：" prop="successfulLink">
          <el-input
            v-model="targetForm.successfulLink"
            placeholder="请输入支付成功跳转链接，如https://xxxx"
            clearable
            :disabled="targetStyle"
          />
        </el-form-item>
        <el-form-item label="支付失败跳转链接：" prop="failedLink">
          <el-input
            v-model="targetForm.failedLink"
            placeholder="请输入支付失败跳转链接，如https://xxxx"
            clearable
            :disabled="targetStyle"
          />
        </el-form-item>
      </el-form>
    </v-form-card>
  </div>
</template>
<script>
import Sortable from "sortablejs";
import VFormCard from "@/components/form/v-form-card.vue";

export default {
  name: "PayOperate",
  components: {
    "v-form-card": VFormCard,
  },
  data() {
    this.queryUrl = "/pay/payway/list.json";
    var checkLink = (rule, value, callback) => {
      const reg = /(http|https):\/\/([\w.]+\/?)\S*/;
      if (value && !reg.test(value)) {
        callback(new Error("支付跳转链接有误"));
      } else {
        callback();
      }
    };
    return {
      institutionCode: "test",
      businessCode: "test",
      methodButton: "edit",
      sortStyle: true,
      targetButton: "edit",
      targetStyle: true,
      templateRadio: "", // 选项
      // 分页
      pagination: {
        pageSize: 10,
        pageIndex: 1,
        totalNum: 0,
      },
      // table
      tableData: [],
      targetForm: {
        successfulLink: "",
        failedLink: "",
      },
      rules: {
        successfulLink: [{ validator: checkLink, trigger: ["blur", "change"] }],
        failedLink: [{ validator: checkLink, trigger: ["blur", "change"] }],
      },
    };
  },
  created() {
    const res = JSON.parse(localStorage.businessList);
    this.institutionCode = res.institutionCode;
    this.businessCode = res.businessCode;
  },
  mounted() {
    this.getPayList();
    const tbody = document.querySelector(".el-table__body-wrapper tbody");
    const _this = this;
    Sortable.create(tbody, {
      onMove: (evt) => {
        if (this.sortStyle) {
          return false;
        }
      },
      onEnd({ newIndex, oldIndex }) {
        const currRow = _this.tableData.splice(oldIndex, 1)[0];
        _this.tableData.splice(newIndex, 0, currRow);
        _this.tableData.forEach((item, index) => {
          item.paySort = index;
        });
      },
    });
  },
  methods: {
    getPayList() {
      this.$fetch("/pay/payway/list.json", {
        method: "post",
        data: {
          institutionCode: this.institutionCode,
          businessCode: this.businessCode,
        },
      })
        .then((res) => {
          if (res.code === 0) {
            this.tableData = res.data;
            res.data.forEach((item) => {
              if (item.payDefault === 0) {
                this.templateRadio = item.payWayCode;
              }
            });
          }
        })
        .catch(() => {});
      this.$fetch("/pay/business/link.json", {
        method: "post",
        data: {
          institutionCode: this.institutionCode,
          businessCode: this.businessCode,
        },
      })
        .then((res) => {
          if (res.code === 0) {
            this.targetForm = res.data;
          }
        })
        .catch(() => {});
    },
    saveSort() {
      this.tableData.forEach((element, index) => {
        element.paySort = index;
        if (element.payWayCode === this.templateRadio) {
          element.payDefault = 0;
        } else {
          element.payDefault = 1;
        }
      });
      this.$fetch("/pay/payway/sort.json", {
        method: "post",
        data: [...this.tableData],
      })
        .then((res) => {
          if (res.code === 0) {
            this.sortStyle = true;
            this.methodButton = "edit";
          }
        })
        .catch(() => {});
    },
    editSort() {
      this.sortStyle = false;
      this.methodButton = "save";
    },
    saveTarget() {
      this.$refs.mylink.validate((valid) => {
        if (valid) {
          this.$fetch("/pay/business/creat.json", {
            method: "post",
            data: {
              institutionCode: this.institutionCode,
              businessCode: this.businessCode,
              ...this.targetForm,
            },
          })
            .then((res) => {
              if (res.code === 0) {
                this.targetStyle = true;
                this.targetButton = "edit";
              }
            })
            .catch(() => {});
        } else {
          this.$message({
            type: "error",
            message: "跳转链接填写有误请检查!",
          });
          return false;
        }
      });
    },
    editTarget() {
      this.targetStyle = false;
      this.targetButton = "save";
    },
  },
};
</script>
<style lang="less" scoped>
.pay-operate {
  .el-table {
    width: 620px;
  }
  .el-form {
    width: 620px;
  }
}
</style>
