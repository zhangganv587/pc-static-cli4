<!--
 * @Author: 张淦
 * @Date: 2019-11-28 11:12:48
 * @LastEditors: zhanggan
 * @Description: 商户2.0作废
 * @FilePath: /gpay-ops-static/src/pages/merchant/enterApply/payInfo.vue
 -->
<template>
  <div>
    <el-card class="box-card">
      <el-form
        ref="payinfoForm"
        :model="payinfoForm"
        label-width="138px"
        :rules="rules"
      >
        <v-form-card title="账号信息" sub-title="(账号信息介绍)" button="help">
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
                <el-button type="primary" @click="newlyBuild(account, index)">
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
        <v-form-card title="场景信息" sub-title="(支付场景介绍)" button="help">
          <el-form-item label="支付场景：" prop="checkboxGroup">
            <el-checkbox-group v-model="checkboxGroup" @change="changeCheckBox">
              <el-checkbox label="H5页面(在手机中进行支付)" border />
              <el-checkbox label="WEB页面(在电脑中进行支付)" border />
            </el-checkbox-group>
          </el-form-item>
          <v-form-card
            v-show="scenario == 1 || scenario == 3"
            title="H5页面场景支付方式："
            sub-title="(支付场景介绍)"
            button="help"
          >
            <merchant-transfer
              my-style="h5"
              :pay-way-v-o-s="payWayVOS"
              :setting-list="optionalList"
              :disable-transfer="false"
              @addPayWayVOS="addHFIVEPayWayVOS"
            />
          </v-form-card>
          <v-form-card
            v-show="scenario == 2 || scenario == 3"
            title="WEB支付场景支付方式："
            sub-title="(支付场景介绍)"
            button="help"
          >
            <merchant-transfer
              my-style="web"
              :pay-way-v-o-s="payWayVOS"
              :setting-list="optionalList"
              :disable-transfer="false"
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
            <el-button type="primary" @click="handleSubmit('payinfoForm')">
              提交审批
            </el-button>
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
    const validatorCheckbox = (rule, value, callback) => {
      if (!this.checkboxGroup.length) {
        return callback(new Error("支付场景至少选择一种！"));
      } else if (!this.payinfoForm.payWayVOS.length) {
        callback(new Error("场景支付方式至少选择一种！"));
      } else {
        callback();
      }
    };
    return {
      sort: null,
      checkboxGroup: [],
      productNameList: [],
      HFIVEPayWayVOS: [],
      WEBPayWayVOS: [],
      optionalList: [],
      payWayVOS: [],
      accountDetails: {},
      payinfoForm: {},
      accountSettleInfoVOS: {},
      rules: {
        checkboxGroup: [
          { required: true, trigger: "change", validator: validatorCheckbox },
        ],
        auditor: [
          { required: true, message: "审批人不能为空", trigger: "change" },
        ],
      },
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
        this.payinfoForm = { ...newValue, auditor: "" };
        if (newValue.accountVOS) {
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
      immediate: true,
    },
  },
  created() {
    this.getTimeNumber();
  },
  methods: {
    getTimeNumber() {
      this.$fetch("/Index/generate.json", {
        method: "post",
      }).then((res) => {
        if (res.code === 0) {
          this.timeNumber = res.data.num;
        }
      });
    },
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
    handleSubmit(formName) {
      this.payinfoForm.accountSettleInfoVOS = this.payinfoForm.accountVOS;
      this.payinfoForm.payWayVOS = [
        ...this.HFIVEPayWayVOS,
        ...this.WEBPayWayVOS,
      ];
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$fetch("/merchant/apply/query.json", {
            method: "post",
            data: {
              ...this.payinfoForm,
              phase: "TWO",
              applyNo: "SP" + this.timeNumber,
            },
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
.account-form-accountNo {
  margin-right: 10px;
}
.box-card {
  margin-bottom: 50px;
}
</style>
