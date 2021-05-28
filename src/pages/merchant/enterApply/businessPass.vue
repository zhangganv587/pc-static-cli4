<!--
 * @Author: 张淦
 * @Date: 2019-11-28 11:12:48
 * @LastEditors: zhanggan
 * @Description: 商户2.0作废
 * @FilePath: /gpay-ops-static/src/pages/merchant/enterApply/businessPass.vue
 -->
<template>
  <div>
    <el-card class="box-card">
      <div class="reject-box" :class="step[passForm.auditStatus].className">
        <p class="reject-title">
          {{ step[passForm.auditStatus].title
          }}<span class="reject-time"
            >{{ step[passForm.auditStatus].title }}时间：{{
              passForm.applyDate
            }}</span
          >
        </p>
        <p v-if="passForm.auditStatus === 2" class="reject-result">
          {{ step[passForm.auditStatus].desc
          }}{{ passForm.auditMemo ? passForm.auditMemo : "" }}
        </p>
      </div>
      <el-form
        ref="passForm"
        :model="passForm"
        label-width="138px"
        :rules="rules"
      >
        <v-form-card
          title="业务签约公司"
          sub-title="(审批通过后不可修改)"
          :button="step[passForm.auditStatus].buttonShown"
          @handleEdit="handleMerchantEdit"
        >
          <el-form-item
            label="业务签约公司："
            required
            prop="baseInfoVO.merchantNo"
          >
            <div style="display: flex">
              <el-select
                v-model="passForm.baseInfoVO.merchantNo"
                :disabled="readMerchant"
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
              passForm.baseInfoVO.merchantNo
                ? passForm.baseInfoVO.merchantNo
                : ""
            }}
          </el-form-item>
        </v-form-card>
        <v-form-card
          title="业务信息"
          sub-title="(审批通过后不可修改)"
          :button="step[passForm.auditStatus].buttonShown"
          @handleEdit="handleBusinessEdit"
        >
          <el-form-item label="业务编号：">
            {{
              timeNumber ? "YW" + timeNumber : passForm.businessVO.businessCode
            }}
          </el-form-item>
          <el-form-item
            label="业务名称："
            prop="businessVO.businessName"
            required
          >
            <el-input
              v-model="passForm.businessVO.businessName"
              :disabled="readBusiness"
            />
          </el-form-item>
          <el-form-item
            label="业务线："
            required
            prop="businessVO.businessLine"
          >
            <el-select
              v-model="passForm.businessVO.businessLine"
              :disabled="readBusiness"
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
              v-model="passForm.businessVO.memo"
              :disabled="readBusiness"
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
              v-model="passForm.businessVO.businessContractAccount"
              :disabled="readBusiness"
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
              v-model="passForm.businessVO.businessAdminAccount"
              :disabled="readBusiness"
              placeholder="请输入业务管理员OA账号"
            />
            <p class="form-item-extra">管理员可管理商户系统</p>
          </el-form-item>
        </v-form-card>
        <v-form-card
          title="账号信息"
          :button="step[passForm.auditStatus].buttonShown"
          @handleEdit="handleAccountEdit"
        >
          <el-form-item label="所需支付账号：" required prop="accountVOS">
            <el-button v-show="!readAccount" @click="addAccount">
              添加账号
            </el-button>
            <div
              v-for="(account, index) in passForm.accountVOS"
              :key="index"
              class="form-item-account"
            >
              <span>{{ account.paymentAccount }}</span>
              <el-button
                v-show="!readAccount"
                type="text"
                @click="accountDelete(index)"
              >
                删除
              </el-button>
            </div>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              v-model="passForm.memo"
              :disabled="readAccount"
              placeholder="请输入备注"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
        </v-form-card>
        <v-form-card v-if="passForm.auditStatus === 0" title="接口安全信息">
          <el-form-item label="AES秘钥：">
            <el-button type="primary" @click="dialogFormVisible = true">
              点击查看
            </el-button>
          </el-form-item>
        </v-form-card>
        <v-form-card title="审批信息">
          <el-form-item label="审批人：" required prop="auditor">
            <el-select
              v-model="passForm.auditor"
              placeholder="请选择审批人"
              clearable
              :disabled="passForm.auditStatus === 0"
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
            <el-button
              v-show="
                passForm.auditStatus === 2 &&
                (!readMerchant || !readBusiness || !readAccount)
              "
              type="primary"
              @click="handleSubmit('passForm')"
            >
              提交审批
            </el-button>
            <el-button
              v-show="passForm.auditStatus === 0 && from"
              type="primary"
              @click="handleNext"
            >
              下一步
            </el-button>
            <el-button @click="closeSubmit('passForm')"> 关闭 </el-button>
          </el-form-item>
        </v-form-card>
      </el-form>
    </el-card>

    <el-dialog title="秘钥信息" :visible.sync="dialogFormVisible">
      <el-form ref="form">
        <el-form-item
          label="秘钥："
          label-width="140px"
          prop="businessVO.autoGraph"
        >
          {{ passForm.businessVO.autoGraph }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 关闭 </el-button>
      </div>
    </el-dialog>
    <add-account
      :add-dialog-visible="AddDialogVisible"
      @addAccountVOS="addAccountVOS"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import VFormCard from "@/components/form/v-form-card.vue";
import addAccount from "./component/addAccount";

export default {
  name: "BusinessInfo",
  components: {
    "v-form-card": VFormCard,
    "add-account": addAccount,
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
      from: false,
      step: [
        {
          className: "reject-success",
          title: "审核通过",
          desc: "",
          buttonShown: "",
        },
        {
          className: "reject-default",
          title: "待审批",
          desc: "预计需要1到2和工作日",
          buttonShown: "edit",
        },
        {
          className: "reject-error",
          title: "审核驳回",
          desc: "驳回原因：",
          buttonShown: "edit",
        },
      ],
      readMerchant: true,
      readBusiness: true,
      readAccount: true,
      items: [],
      passForm: {
        baseInfoVO: {
          merchantNo: "",
          businessLine: "",
          memo: "",
          businessContractAccount: "",
          businessAdminAccount: "",
        },
        businessVO: {
          businessCode: "",
          businessName: "",
        },
        auditStatus: 1,
      },
      rules: {
        "baseInfoVO.merchantNo": [
          { required: true, message: "业务签约公司不能为空", trigger: "blur" },
        ],
        "businessVO.businessName": [
          { required: true, message: "业务名称不能为空", trigger: "blur" },
        ],
        "businessVO.businessLine": [
          { required: true, message: "业务线不能为空", trigger: "change" },
        ],
        "businessVO.memo": [
          { required: true, message: "业务介绍不能为空", trigger: "blur" },
        ],
        "businessVO.businessContractAccount": [
          { required: true, message: "业务联系人不能为空", trigger: "blur" },
        ],
        "businessVO.businessAdminAccount": [
          { required: true, message: "业务管理员不能为空", trigger: "blur" },
        ],
        accountVOS: [
          { required: true, message: "支付收款账号不能为空", trigger: "blur" },
        ],
        auditor: [
          { required: true, message: "审批人不能为空", trigger: "change" },
        ],
      },
      // dialog
      AddDialogVisible: false,
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
    details(newValue) {
      if (newValue && typeof newValue === "object") {
        this.passForm = { ...newValue };
        this.passForm.applyDate = this.$common.timeFormat(
          this.passForm.applyDate
        );
      }
    },
  },
  created() {},
  mounted() {
    this.from = this.$store.state.auditStatus.from === 1;
  },
  methods: {
    handleMerchantEdit() {
      this.readMerchant = false;
      this.passForm.auditor = "";
    },
    handleBusinessEdit() {
      this.readBusiness = false;
      this.passForm.auditor = "";
    },
    handleAccountEdit() {
      this.readAccount = false;
      this.passForm.auditor = "";
    },
    addAccount() {
      this.AddDialogVisible = true;
    },
    accountDelete(index) {
      this.passForm.accountVOS.splice(index, 1);
    },
    closeDialog() {
      this.newlyDialogVisible = false;
      this.AddDialogVisible = false;
    },
    addAccountVOS(res) {
      let accountVOS = this.passForm.accountVOS;
      accountVOS.push(res);
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
      accountVOS = Array.from(new Set(accountVOS));
      this.$refs["searchForm"].clearValidate("accountVOS");
    },
    closeSubmit() {
      this.$router.push({ path: "/merchant/approval" });
    },
    handleSubmit(auditStatus) {
      this.$fetch("/merchant/apply/query.json", {
        method: "post",
        data: {
          ...this.passForm,
        },
      }).then((res) => {
        if (res.code === 0) {
          this.$router.push({ path: "/merchant/approval" });
        }
      });
    },
    handleNext() {
      this.$store.commit("GET_ADUIT_STATUS", {
        step: 2,
        status: null,
        style: this.$store.state.auditStatus.style,
        from: 1,
      });
      this.$eventBus.$emit("active-change", "second");
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
