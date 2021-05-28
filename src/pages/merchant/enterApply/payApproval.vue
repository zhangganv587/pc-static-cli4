<!--
 * @Author: 张淦
 * @Date: 2019-11-28 11:12:48
 * @LastEditors: zhanggan
 * @Description: 商户2.0作废
 * @FilePath: /gpay-ops-static/src/pages/merchant/enterApply/payApproval.vue
 -->
<template>
  <div>
    <el-card class="box-card">
      <el-form ref="payinfoForm" :model="payinfoForm" label-width="138px">
        <el-form-item label="申请人：">
          {{ payinfoForm.applyOperator ? payinfoForm.applyOperator : "" }}
        </el-form-item>
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
          <el-form-item label="支付场景：">
            <el-checkbox-group
              v-model="checkboxGroup"
              :disabled="true"
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
            button="help"
          >
            <merchant-transfer
              my-style="h5"
              :setting-list="optionalList"
              :pay-way-v-o-s="payWayVOS"
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
              :setting-list="optionalList"
              :pay-way-v-o-s="payWayVOS"
              @addPayWayVOS="addWEBPayWayVOS"
            />
          </v-form-card>
          <el-form-item label=" ">
            <el-button type="primary" @click="handleAdopt(0)"> 通过 </el-button>
            <el-button @click="handleReject(2)"> 驳回 </el-button>
          </el-form-item>
        </v-form-card>
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
import MerchantTransfer from ",/component/merchant-transfer";
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
      sort: null,
      checkboxGroup: [],
      productNameList: [],
      optionalList: [],
      HFIVEPayWayVOS: [],
      WEBPayWayVOS: [],
      accountDetails: {},
      payinfoForm: {},
      accountSettleInfoVOS: {},
      payWayVOS: [],
      // transfer data
      scenario: 0,
      form: {
        memo: "",
      },
      rules: {
        memo: [{ required: true, message: "驳回原因必填", trigger: "change" }],
      },
      // dialog
      accountInfoDialogVisible: false,
      dialogFormVisible: false,
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
          this.payWayVOS = newValue.payWayVOS;
          let scenario = 0;
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
          this.productNameList = this.getProductNameList(newValue);
        }
      },
    },
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
    handleAdopt(auditStatus) {
      this.payinfoForm.payWayVOS = [
        ...this.HFIVEPayWayVOS,
        ...this.WEBPayWayVOS,
      ];
      this.$confirm("确定审批通过?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$fetch("/review/audit.json", {
            method: "post",
            data: {
              ...this.payinfoForm,
              auditStatus: 0,
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
      this.payinfoForm.auditStatus = auditStatus;
      this.dialogFormVisible = true;
    },
    resultSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$fetch("/review/audit.json", {
            method: "post",
            data: {
              ...this.payinfoForm,
              memo: this.form.memo,
              auditStatus: 2,
              accountVOS: this.accountVOS,
            },
          }).then((res) => {
            this.$refs[formName].resetFields();
            if (res.code === 0) {
              this.$router.push({ path: "/merchant/approval" });
            }
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
.account-form-accountNo {
  margin-right: 10px;
}
.box-card {
  margin-bottom: 50px;
}
</style>
