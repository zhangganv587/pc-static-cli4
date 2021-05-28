<!--
 * @Author: 张淦
 * @Date: 2019-11-28 11:12:48
 * @LastEditors: 张淦
 * @Description: 商户2.0作废
 * @FilePath: /gpay-ops-static/src/pages/enterApply/businessInfo.vue
 -->
<template>
  <div>
    <el-row>
      <el-col :span="16">
        <el-form
          ref="searchForm"
          :model="searchForm"
          label-width="138px"
          :rules="rules"
        >
          <v-form-card title="业务签约公司" sub-title="(审批通过后不可修改)">
            <el-form-item
              label="业务签约公司："
              required
              prop="baseInfoVO.merchantNo"
            >
              <div style="display: flex">
                <el-select
                  v-model="searchForm.baseInfoVO.merchantNo"
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
              {{ searchForm.baseInfoVO.merchantNo }}
            </el-form-item>
          </v-form-card>
          <v-form-card title="业务信息" sub-title="(审批通过后不可修改)">
            <el-form-item
              label="业务名称："
              prop="businessVO.businessName"
              :rules="[
                {
                  required: true,
                  message: '业务名称不能为空',
                  trigger: 'blur,change',
                },
              ]"
              required
            >
              <el-input
                v-model="searchForm.businessVO.businessName"
                :disabled="readStyle"
              />
            </el-form-item>
            <el-form-item label="业务编号："> YW{{ timeNumber }} </el-form-item>
            <el-form-item
              label="业务线："
              required
              prop="businessVO.businessLine"
            >
              <el-select
                v-model="searchForm.businessVO.businessLine"
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
                v-model="searchForm.businessVO.memo"
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
                v-model="searchForm.businessVO.businessContractAccount"
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
                v-model="searchForm.businessVO.businessAdminAccount"
                :disabled="readStyle"
                placeholder="请输入业务管理员OA账号"
              />
              <p class="form-item-extra">管理员可管理商户系统</p>
            </el-form-item>
          </v-form-card>
          <v-form-card title="账号信息">
            <el-form-item label="所需支付账号：" required prop="accountVOS">
              <el-button @click="addAccount"> 添加账号 </el-button>
              <div
                v-for="(account, index) in searchForm.accountVOS"
                :key="index"
                class="form-item-account"
              >
                <span>{{ account.paymentAccount }}</span>
                <el-button type="text" @click="accountDelete(index)">
                  删除
                </el-button>
              </div>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input
                v-model="searchForm.memo"
                :disabled="readStyle"
                placeholder="请输入备注"
                type="textarea"
                :rows="3"
              />
            </el-form-item>
          </v-form-card>
          <v-form-card title="审批信息">
            <el-form-item label="审批人：" required prop="auditor">
              <el-select
                v-model="searchForm.auditor"
                :disabled="readStyle"
                placeholder="请选择审批人"
                clearable
              >
                <el-option
                  v-for="(finance, index) in financeList"
                  :key="`finance${index}`"
                  :label="finance.finance"
                  :value="finance.code"
                />
              </el-select>
              <p class="form-item-extra">
                请选择财务人员提交审批，提交审批后审批人将进行审批，审批结果将以邮件方式通知，请注意查收
              </p>
            </el-form-item>
            <el-form-item label=" ">
              <el-button type="primary" @click="handleSubmit('searchForm')">
                提交审批
              </el-button>
            </el-form-item>
          </v-form-card>
        </el-form>
      </el-col>
    </el-row>
    <newly-build-busine :newly-dialog-visible="newlyDialogVisible" />
    <add-account
      :add-dialog-visible="AddDialogVisible"
      @addAccountVOS="addAccountVOS"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import VFormCard from "@/components/form/v-form-card.vue";
import newlyBuildBusine from "./component/newlyBuildBusine";
import addAccount from "./component/addAccount";

export default {
  name: "BusinessInfo",
  components: {
    "v-form-card": VFormCard,
    "newly-build-busine": newlyBuildBusine,
    "add-account": addAccount,
  },
  data() {
    const validatorAccountVOS = (rule, value, callback) => {
      if (value.length === 0) {
        return callback(new Error("支付收款账号不能为空"));
      } else {
        callback();
      }
    };
    return {
      readStyle: false,
      searchForm: {
        baseInfoVO: {
          // 商户基本信息
          existed: true, // 是否存在，默认true ；false：新建
          merchantNo: "",
        },
        businessVO: {
          // 业务信息
          businessAdminAccount: "",
          businessCode: "",
          businessContractAccount: "",
          businessLine: "",
          businessName: "",
          memo: "",
        },
        accountVOS: [],
        memo: "",
        auditor: "",
        applyNo: "",
        auditStatus: 1, // 审批状态 0:审核通过 1:待审核 2:审核驳回
        phase: "ONE", // 申请阶段 one:商户、业务信息申请 two:支付信息申请 three:支付运营
      },
      rules: {
        "baseInfoVO.merchantNo": [
          { required: true, message: "业务签约公司不能为空", trigger: "blur" },
        ],
        "businessVO.businessLine": [
          { required: true, message: "业务线不能为空", trigger: "change" },
        ],
        "businessVO.memo": [
          {
            required: true,
            message: "业务介绍不能为空",
            trigger: "blur,change",
          },
        ],
        "businessVO.businessContractAccount": [
          {
            required: true,
            message: "业务联系人不能为空",
            trigger: "blur,change",
          },
        ],
        "businessVO.businessAdminAccount": [
          {
            required: true,
            message: "业务管理员不能为空",
            trigger: "blur,change",
          },
        ],
        accountVOS: [
          { required: true, trigger: "blur", validator: validatorAccountVOS },
        ],
        auditor: [
          { required: true, message: "审批人不能为空", trigger: "change" },
        ],
      },
      // dialog
      newlyDialogVisible: false,
      AddDialogVisible: false,
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
    timeNumber(newValue) {
      this.searchForm.applyNo = "SP" + newValue;
      this.searchForm.businessVO.businessCode = "YW" + newValue;
    },
  },
  created() {},
  mounted() {
    this.searchForm.applyNo = "SP" + this.timeNumber;
    this.searchForm.businessVO.businessCode = "YW" + this.timeNumber;
  },
  methods: {
    newlyBuild() {
      this.newlyDialogVisible = true;
    },
    addAccount() {
      this.AddDialogVisible = true;
    },
    closeDialog() {
      this.newlyDialogVisible = false;
      this.AddDialogVisible = false;
    },
    addAccountVOS(res) {
      const accountVOS = this.searchForm.accountVOS;
      accountVOS.push(res);
      // this.searchForm.accountVOS = Array.from(new Set(accountVOS));
      for (var i = 0; i < accountVOS.length; i++) {
        for (var j = i + 1; j < accountVOS.length; j++) {
          if (
            accountVOS[i].accountNo === accountVOS[j].accountNo &&
            accountVOS[i].payWayCode === accountVOS[j].payWayCode
          ) {
            accountVOS.splice(j, 1);
            j--;
          }
        }
      }
      this.searchForm.accountVOS = accountVOS;
      this.$refs["searchForm"].clearValidate("accountVOS");
    },
    accountDelete(index) {
      this.searchForm.accountVOS.splice(index, 1);
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$fetch("/merchant/apply/query.json", {
            method: "post",
            data: { ...this.searchForm },
          }).then((res) => {
            if (res.code === 0) {
              this.$router.push({ path: "/merchant/approval" });
            }
          });
        }
      });
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
