<!--
 * @Author: 张淦
 * @Date: 2019-11-28 11:12:48
 * @LastEditors: zhanggan
 * @Description: 商户2.0作废
 * @FilePath: /gpay-ops-static/src/pages/merchant/enterApply/businessApproval.vue
 -->
<template>
  <div>
    <el-card class="box-card">
      <el-form ref="approvalForm" :model="approvalForm" label-width="144px">
        <el-form-item label="申请人：">
          {{ approvalForm.applyOperator ? approvalForm.applyOperator : "" }}
        </el-form-item>
        <v-form-card title="业务签约公司" sub-title="(审批通过后不可修改)">
          <el-form-item
            label="业务签约公司："
            required
            prop="baseInfoVO.merchantNo"
          >
            <div style="display: flex">
              <el-select
                v-model="approvalForm.baseInfoVO.merchantNo"
                :disabled="readStyle"
                placeholder="请选择业务签约公司"
                clearable
                style="margin-right: 10px"
              >
                <el-option
                  v-for="(merchant, index) in merchantList"
                  :key="`merchant${index}`"
                  :label="merchant.merchant"
                  :value="merchant.merchantNo"
                />
              </el-select>
              <!-- <el-button
                type="primary"
                @click="newlyBuild"
              >
                新建商户
              </el-button> -->
            </div>
            <p class="form-item-extra">业务签约使用的公司全称</p>
          </el-form-item>
          <el-form-item label="商户号：">
            {{
              approvalForm.baseInfoVO.merchantNo
                ? approvalForm.baseInfoVO.merchantNo
                : ""
            }}
          </el-form-item>
        </v-form-card>
        <v-form-card title="业务信息" sub-title="(审批通过后不可修改)">
          <el-form-item label="业务编号：">
            {{
              timeNumber
                ? "YW" + timeNumber
                : approvalForm.businessVO.businessCode
            }}
          </el-form-item>
          <el-form-item
            label="业务名称："
            prop="businessVO.businessName"
            required
          >
            <el-input
              v-model="approvalForm.businessVO.businessName"
              :disabled="readStyle"
            />
          </el-form-item>
          <el-form-item
            label="业务线："
            required
            prop="businessVO.businessLine"
          >
            <el-select
              v-model="approvalForm.businessVO.businessLine"
              :disabled="readStyle"
              placeholder="请选择业务线"
              clearable
            >
              <el-option
                v-for="(business, index) in businessList"
                :key="`business${index}`"
                :label="business.name"
                :value="business.code"
              />
            </el-select>
            <p class="form-item-extra">业务所在部门</p>
          </el-form-item>
          <el-form-item label="业务介绍：" required prop="businessVO.memo">
            <el-input
              v-model="approvalForm.businessVO.memo"
              :disabled="readStyle"
              placeholder="请输入业务介绍"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
          <el-form-item
            label="业务联系人账号："
            required
            prop="businessVO.businessContractAccount"
          >
            <el-input
              v-model="approvalForm.businessVO.businessContractAccount"
              :disabled="readStyle"
              placeholder="请输入业务联系人OA账号"
            />
            <p class="form-item-extra">联系人方便联系</p>
          </el-form-item>
          <el-form-item
            label="业务管理员账号："
            required
            prop="businessVO.businessAdminAccount"
          >
            <el-input
              v-model="approvalForm.businessVO.businessAdminAccount"
              :disabled="readStyle"
              placeholder="请输入业务管理员OA账号"
            />
            <p class="form-item-extra">管理员可管理商户系统</p>
          </el-form-item>
        </v-form-card>
        <v-form-card title="账号信息">
          <div v-for="(account, sort) in accountVOS" :key="sort">
            <el-form-item :label="`${account.payWayName}账号：`" required>
              <el-select
                v-model="account.accountNo"
                placeholder="请选择支付账号"
              >
                <el-option key="99" label="无可用账号" value="99" />
                <el-option
                  v-for="(item, index) in accountVOS[sort].payWayList"
                  :key="index"
                  :label="item.paymentAccount"
                  :value="item.accountNo"
                />
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="备注：">
            <el-input
              v-model="approvalForm.memo"
              :disabled="readStyle"
              placeholder="请输入备注"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
        </v-form-card>
        <el-form-item label=" ">
          <el-button type="primary" @click="handleAdopt(0)"> 通过 </el-button>
          <el-button @click="handleReject(2)"> 驳回 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog title="驳回原因" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label="驳回原因：" label-width="140px" prop="memo">
          <el-input
            v-model="form.memo"
            autocomplete="off"
            placeholder="请输入驳回原因"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('form')"> 取消 </el-button>
        <el-button type="primary" @click="resultSubmit('form')">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import VFormCard from "@/components/form/v-form-card.vue";

export default {
  name: "BusinessInfo",
  components: {
    "v-form-card": VFormCard,
  },
  props: {
    details: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      id: "",
      readStyle: true,
      accountVOS: [],
      approvalForm: {
        businessVO: {
          businessCode: "",
          memo: "",
        },
        baseInfoVO: {
          accountNo: "",
          merchantNo: null,
          businessList: "",
        },
      },
      form: {
        memo: "",
      },
      rules: {
        memo: [{ required: true, message: "驳回原因必填", trigger: "change" }],
      },
      // dialog
      dialogFormVisible: false,
    };
  },
  computed: {
    ...mapGetters({
      financeList: "financeList",
      merchantList: "merchantList",
      businessList: "businessList",
      timeNumber: "timeNumber",
    }),
  },
  watch: {
    details: {
      handler(newValue) {
        this.approvalForm = newValue;
        if (newValue.accountVOS) {
          newValue.accountVOS.forEach((element) => {
            this.getPayWayList(element.payWayId, element);
          });
        }
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    getPayWayList(payWayId, row) {
      this.$fetch("/account/query.json", {
        method: "post",
        data: {
          payWayId,
          pagesSize: 999,
        },
      }).then((res) => {
        const payWayList = [];
        if (res.data.dataList) {
          res.data.dataList.forEach((item) => {
            payWayList.push({ ...item });
          });
          this.accountVOS.push({
            ...row,
            accountId: row.id,
            payWayList: payWayList,
          });
        } else {
          this.accountVOS.push({
            ...row,
            accountId: row.id,
            getPayWayList: [],
          });
        }
      });
    },
    handleAdopt(auditStatus) {
      this.approvalForm.auditStatus = auditStatus;
      this.$confirm("确定审批通过?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$fetch("/review/audit.json", {
            method: "post",
            data: {
              ...this.approvalForm,
              accountVOS: this.accountVOS,
            },
          }).then((res) => {
            if (res.code === 0) {
              this.$router.push({ path: "/merchant/approval" });
            }
          });
        })
        .catch(() => {});
    },
    handleReject(auditStatus) {
      this.approvalForm.auditStatus = auditStatus;
      this.dialogFormVisible = true;
    },
    resultSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$fetch("/review/audit.json", {
            method: "post",
            data: {
              ...this.approvalForm,
              memo: this.form.memo,
              auditStatus: 2,
              accountVOS: this.accountVOS,
            },
          }).then((res) => {
            this.$refs[formName].resetFields();
            this.$router.push({ path: "/merchant/approval" });
          });
        } else {
          this.$message({
            type: "error",
            message: "提交失败请检查!",
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.dialogFormVisible = false;
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style lang="less" scoped>
.form-item-account {
  margin: 20px 0;
  background: #ddd;
  border-radius: 5px;
  span {
    padding: 10px;
  }
}
</style>
