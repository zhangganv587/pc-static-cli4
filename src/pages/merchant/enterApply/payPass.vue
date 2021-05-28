<!--
 * @Author: 张淦
 * @Date: 2019-11-28 11:12:48
 * @LastEditors: 张淦
 * @Description: 商户2.0作废
 * @FilePath: /gpay-ops-static/src/pages/enterApply/payPass.vue
 -->
<template>
  <div>
    <el-card class="box-card">
      <div class="reject-box" :class="step[payinfoForm.auditStatus].className">
        <p class="reject-title">
          {{ step[payinfoForm.auditStatus].title
          }}<span class="reject-time"
            >{{ step[payinfoForm.auditStatus].title }}时间：{{
              payinfoForm.applyDate
            }}</span
          >
        </p>
        <p class="reject-result">
          {{ step[payinfoForm.auditStatus].desc
          }}{{ payinfoForm.auditMemo ? payinfoForm.auditMemo : "" }}
        </p>
      </div>
      <el-form
        ref="payinfoForm"
        :model="payinfoForm"
        label-width="138px"
        :rules="rules"
      >
        <v-form-card
          title="账号信息"
          sub-title="(账号信息介绍)"
          @handleEdit="handlePayInfoEdit"
        >
          <div
            v-for="(account, index) in payinfoForm.accountVOS"
            :key="`account${index}`"
          >
            <el-form-item :label="account.payWayName + '：'">
              <div
                v-show="!account.accountNo || !account.ownerCompany"
                style="display: flex"
              >
                <span class="account-form-accountNo">无可用账号</span>
                <el-button
                  type="primary"
                  :disabled="readPayInfo"
                  @click="newlyBuild(account, index)"
                >
                  新增账号
                </el-button>
              </div>
              <div
                v-show="account.accountNo && account.ownerCompany"
                style="display: flex"
              >
                <span class="account-form-accountNo"
                  >{{ account.accountNo }}-{{ account.ownerCompany }}</span
                >
                <el-button type="text" @click="checkDetails(account, index)">
                  详情>>
                </el-button>
              </div>
            </el-form-item>
            <el-form-item label="已开通支付产品：">
              {{ productNameList[index] }}
            </el-form-item>
          </div>
        </v-form-card>
        <v-form-card
          title="场景信息"
          sub-title="(支付场景介绍)"
          :button="step[payinfoForm.auditStatus].buttonShown"
          @handleEdit="handlePayScenarioEdit"
        >
          <el-form-item label="支付场景：">
            <el-checkbox-group
              v-model="checkboxGroup"
              :disabled="readPayScenario"
              @change="changeCheckBox"
            >
              <el-checkbox label="H5页面(在手机中进行支付)" border />
              <el-checkbox label="WEB页面(在电脑中进行支付)" border />
            </el-checkbox-group>
          </el-form-item>
          <v-form-card
            v-show="scenario == 1 || scenario == 3"
            title="H5页面场景支付方式："
            sub-title="(支付场景介绍)"
          >
            <merchant-transfer
              my-style="h5"
              :setting-list="optionalList"
              :pay-way-v-o-s="payWayVOS"
              :disable-transfer="readPayScenario"
              @addPayWayVOS="addHFIVEPayWayVOS"
            />
          </v-form-card>
          <v-form-card
            v-show="scenario == 2 || scenario == 3"
            title="WEB支付场景支付方式："
            sub-title="(支付场景介绍)"
            :button="step[payinfoForm.auditStatus].buttonShown"
          >
            <merchant-transfer
              my-style="web"
              :setting-list="optionalList"
              :pay-way-v-o-s="payWayVOS"
              :disable-transfer="readPayScenario"
              @addPayWayVOS="addWEBPayWayVOS"
            />
          </v-form-card>
        </v-form-card>
        <v-form-card title="审批信息">
          <el-form-item label="审批人：" required prop="auditor">
            <el-select
              v-model="payinfoForm.auditor"
              placeholder="请选择审批人"
              clearable
              :disabled="payinfoForm.auditStatus === 0"
            >
              <el-option
                v-for="(finance, index) in financeList"
                :key="`finance${index}`"
                :label="finance.finance"
                :value="finance.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label=" ">
            <el-button
              v-show="
                payinfoForm.auditStatus === 2 &&
                (!readPayInfo || !readPayScenario)
              "
              type="primary"
              @click="handleSubmit('payinfoForm')"
            >
              提交审批
            </el-button>
            <el-button
              v-show="payinfoForm.auditStatus === 0 && from"
              type="primary"
              @click="handleNext"
            >
              下一步
            </el-button>
            <el-button @click="closeSubmit('payinfoForm')"> 关闭 </el-button>
          </el-form-item>
        </v-form-card>
      </el-form>
    </el-card>
    <account-info
      :info-dialog-visible="accountInfoDialogVisible"
      :account-details="accountDetails"
      @addNewAccount="addNewAccount"
    />
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import VFormCard from "@/components/form/v-form-card.vue";
import MerchantTransfer from "./component/merchant-transfer";
import accountInfo from "./component/accountInfo";

export default {
  name: "BusinessInfo",
  components: {
    "v-form-card": VFormCard,
    "merchant-transfer": MerchantTransfer,
    "account-info": accountInfo,
  },
  props: {
    details: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      from: false,
      sort: null,
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
      readPayInfo: true,
      readPayScenario: true,
      checkboxGroup: [],
      productNameList: [],
      optionalList: [],
      HFIVEPayWayVOS: [],
      WEBPayWayVOS: [],
      accountDetails: {},
      payinfoForm: {
        auditStatus: 1,
      },
      accountSettleInfoVOS: {},
      rules: {
        auditor: [
          { required: true, message: "审批人不能为空", trigger: "change" },
        ],
      },
      payWayVOS: [],
      // transfer data
      scenario: 0,
      // dialog
      accountInfoDialogVisible: false,
    };
  },
  computed: {
    ...mapGetters({
      financeList: "financeList",
      merchantChannelList: "merchantChannelList",
    }),
  },
  watch: {
    details: {
      handler(newValue) {
        if (newValue) {
          this.payinfoForm = {
            accountSettleInfoVOS: newValue.accountVOS,
            ...newValue,
          };
          this.payinfoForm.applyDate = this.$common.timeFormat(
            this.payinfoForm.applyDate
          );
          this.productNameList = this.getProductNameList(newValue);
        }
        if (newValue.payWayVOS) {
          let scenario = 0;
          this.payWayVOS = newValue.payWayVOS;
          this.payWayVOS.forEach((data) => {
            data.productName = data.accountPayInfoVO.productName;
            if (
              data.sceneType === 1 &&
              this.checkboxGroup.indexOf("H5页面(在手机中进行支付)") === -1
            ) {
              this.checkboxGroup.push("H5页面(在手机中进行支付)");
              scenario += 1;
            } else if (
              data.sceneType === 2 &&
              this.checkboxGroup.indexOf("WEB页面(在电脑中进行支付)") === -1
            ) {
              this.checkboxGroup.push("WEB页面(在电脑中进行支付)");
              scenario += 2;
            }
          });
          this.scenario = scenario;
        }
      },
    },
  },
  mounted() {
    this.from = this.$store.state.auditStatus.from === 1;
  },
  methods: {
    getProductNameList(newValue) {
      let settingList = [];
      const payWayList = [];
      const productName = [];
      const productNameList = [];
      newValue.accountVOS.forEach((element) => {
        if (element.payDTOList !== null && element.payDTOList.length > 0) {
          element.payDTOList.forEach((item) => {
            productName.push(item.productName);
          });
          productNameList.push(
            Array.from(new Set(productName))
              .filter((el) => {
                return el !== "";
              })
              .join("、")
          );
          settingList = [...element.payDTOList, ...settingList];
        } else {
          productNameList.push("无");
        }
        payWayList.push({
          payWayId: element.payWayId,
          accountNo: element.accountNo,
        });
      });
      this.getSceneList(
        Array.from(new Set(payWayList)),
        Array.from(new Set(settingList))
      );
      return productNameList;
    },
    getSceneList(payWayList, settingList) {
      const optionalList = [];
      this.$fetch("/scene/query.json", {
        method: "post",
        data: { pageSize: 999 },
      })
        .then((res) => {
          if (res.data.dataList.length) {
            res.data.dataList.forEach((element) => {
              payWayList.forEach((list) => {
                if (element.payWayId === list.payWayId) {
                  optionalList.push({ ...element, accountNo: list.accountNo });
                }
              });
            });
            this.optionalList = optionalList;
            this.getOptionalList(optionalList, settingList);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getOptionalList(optionalList, settingList) {
      optionalList.forEach((data, index) => {
        settingList.forEach((item) => {
          if (item.productType === data.productType) {
            this.optionalList[index] = {
              isSetting: true,
              accountNo: item.accountNo,
              accountPayInfoVO: item,
              ...data,
            };
          }
        });
      });
    },
    handlePayInfoEdit() {
      this.readPayInfo = false;
      this.payinfoForm.auditor = "";
    },
    handlePayScenarioEdit() {
      this.readPayScenario = false;
      this.payinfoForm.auditor = "";
    },
    newlyBuild(details, index) {
      this.sort = index;
      this.accountDetails = details;
      this.accountInfoDialogVisible = true;
    },
    checkDetails(details, index) {
      this.sort = index;
      this.accountDetails = { ...details, editStyle: true };
      this.accountInfoDialogVisible = true;
    },
    addHFIVEPayWayVOS(res) {
      this.HFIVEPayWayVOS = res;
    },
    addWEBPayWayVOS(res) {
      this.WEBPayWayVOS = res;
    },
    closeDialog() {
      this.accountInfoDialogVisible = false;
    },
    changeCheckBox() {
      let scenario = 0;
      this.checkboxGroup.forEach((element) => {
        if (element === "H5页面(在手机中进行支付)") {
          scenario += 1;
        } else if (element === "WEB页面(在电脑中进行支付)") {
          scenario += 2;
        }
      });
      this.scenario = scenario;
    },
    addNewAccount(row) {
      this.payinfoForm.accountVOS[this.sort] = {
        payWayName: this.payinfoForm.accountVOS[this.sort].payWayName,
        ...row,
      };
      const optionalList = [];
      this.optionalList.forEach((element) => {
        if (
          element.payWayId === this.payinfoForm.accountVOS[this.sort].payWayId
        ) {
          optionalList.push({ ...element, accountNo: row.accountNo });
        } else {
          optionalList.push(element);
        }
      });
      this.optionalList = optionalList;
    },
    closeSubmit() {
      this.$router.push({ path: "/merchant/approval" });
    },
    handleSubmit(formName) {
      if (this.HFIVEPayWayVOS.length || this.WEBPayWayVOS.length) {
        this.payinfoForm.payWayVOS = [
          ...this.HFIVEPayWayVOS,
          ...this.WEBPayWayVOS,
        ];
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$fetch("/merchant/apply/query.json", {
            method: "post",
            data: { ...this.payinfoForm },
          }).then((res) => {
            if (res.code === 0) {
              this.$router.push({ path: "/merchant/approval" });
            }
          });
        }
      });
    },
    handleNext() {
      this.$store.commit("GET_ADUIT_STATUS", {
        step: 3,
        status: null,
        style: this.$store.state.auditStatus.style,
        from: 1,
      });
      this.$eventBus.$emit("active-change", "third");
    },
  },
};
</script>
<style lang="less" scoped>
.account-form-accountNo {
  margin-right: 10px;
}
.box-card {
  margin-bottom: 50px;
}
</style>
