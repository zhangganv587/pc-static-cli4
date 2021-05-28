<!--
 * @Author: zhanggan
 * @Date: 2020-11-20 16:05:33
 * @LastEditors: zhanggan
 * @Description: 健康账户管理 - 用户管理 - 用户账户管理 - 详情弹框
 * @FilePath: /gpay-ops-static/src/pages/healthAccount/component/accountDetialDialog.vue
-->
<template>
  <v-dialog
    :title="myTitle"
    dialog-id="accountDetialDialog"
    @dialog-close="handleResetForm"
    @dialog-open="getAccountDetial"
  >
    <el-form ref="dialogFormRef" label-width="120px" :model="formModel">
      <!-- 当为红包时 -->
      <div v-if="row.acctType === 'redaccount'">
        <el-form-item label="红包可用余额：" prop="redAmt">
          {{
            !!formModel.redAmt ? $common.moneyFormat(formModel.redAmt) : 0.0
          }}元
        </el-form-item>
      </div>
      <!-- 当为健康账户时 -->
      <div
        v-else-if="
          row.acctType === 'member' ||
          row.acctType === 'reward' ||
          row.acctType === 'helpIncome'
        "
      >
        <el-form-item label="待到账金额：" prop="noArriveAmt">
          {{
            !!formModel.noArriveAmt
              ? $common.moneyFormat(formModel.noArriveAmt)
              : 0.0
          }}元
        </el-form-item>
        <el-form-item label="可提现金额：" prop="withoutAmt">
          {{
            !!formModel.withoutAmt
              ? $common.moneyFormat(formModel.withoutAmt)
              : 0.0
          }}元
        </el-form-item>
      </div>
      <!-- 当为银行卡时 -->
      <div v-else>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="余额" name="first">
            <el-form-item label="现金可用余额：">
              {{
                !!formModel.acccountBal
                  ? $common.moneyFormat(formModel.acccountBal)
                  : 0.0
              }}元
            </el-form-item>
            <!-- <el-form-item
              label="红包可用余额："
              prop="redBal"
            >
              {{ $common.moneyFormat(formModel.redBal)||0 }}元
            </el-form-item> -->
            <el-form-item label="昨日收益：" prop="yesterdayProfit">
              {{
                !!formModel.yesterdayProfit
                  ? $common.moneyFormat(formModel.yesterdayProfit)
                  : 0.0
              }}元
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="银行卡" name="second">
            <el-form-item label="银行卡号：" prop="bankCardNo">
              {{ formModel.bankCardNo }}
            </el-form-item>
            <el-form-item label="银行客户号：" prop="custNo">
              {{ formModel.custNo }}
            </el-form-item>
            <el-form-item label="开卡行：" prop="bankName">
              {{ formModel.bankName }}
            </el-form-item>
            <el-form-item label="卡类型：" prop="cardType">
              {{ formModel.cardType === "D" ? "借记卡" : "信用卡" }}
            </el-form-item>
            <el-form-item label="开户路由：" prop="channelName">
              {{ formModel.channelName }}
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer" />
  </v-dialog>
</template>

<script>
import dialogFormMixin from "@/mixins/dialogFormMixin";

export default {
  mixins: [dialogFormMixin],
  props: {
    row: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      activeName: "first",
      formModel: {
        acccountBal: 0,
        yesterdayProfit: 0,
        redBal: null,
        bankNo: null,
        bankName: null,
        cardType: null,
        channelName: null,
        custNo: null,
        accountMemberId: null,
      },
    };
  },
  computed: {
    myTitle() {
      switch (this.row.acctType) {
        case "redaccount":
          return "红包账户详情";
        case "member":
          return "业务账户详情";
        case "reward":
          return "业务账户详情";
        case "helpIncome":
          return "业务账户详情";
        default:
          return "银行账户详情";
      }
    },
  },
  methods: {
    getAccountDetial() {
      this.$fetch("/haccount/account/member/accountdetail", {
        method: "post",
        data: {
          accountMemberId: this.row.accountMemberId,
        },
      })
        .then((res) => {
          if (res.code === 0) {
            this.formModel = res.data;
            this.formModel.custNo = this.row.custNo;
          }
        })
        .catch(() => {});
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>
