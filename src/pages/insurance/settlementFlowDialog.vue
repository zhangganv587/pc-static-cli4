<!--
 * @Author: 张淦
 * @Date: 2020-03-31 10:41:08
 * @LastEditors: 张淦
 * @Description: 医保后台-结算详情
 * @FilePath: /gpay-ops-static/src/pages/insurance/settlementFlowDialog.vue
 -->
<template>
  <v-dialog
    title="结算流水"
    dialog-id="settlementFlow"
    @dialog-close="handleResetForm"
  >
    <div class="flow-title">
      <span class="title-block" />
      <span class="title-text">就诊信息</span>
    </div>
    <el-row>
      <el-col :span="24">
        <div class="grid-content">
          <span class="grid-lable">就诊人：</span>
          <span class="grid-value">{{ formModel.userName || "无" }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="grid-content">
          <span class="grid-lable">医保卡号：</span>
          <span class="grid-value">{{ formModel.patientId || "无" }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="grid-content">
          <span class="grid-lable">医保中心：</span>
          <span class="grid-value">{{ formModel.miCenterName || "无" }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="grid-content">
          <span class="grid-lable">医疗机构：</span>
          <span class="grid-value">{{ formModel.hopsName || "无" }}</span>
        </div>
      </el-col>
    </el-row>
    <div class="flow-title">
      <span class="title-block" />
      <span class="title-text">结算信息</span>
    </div>
    <el-row>
      <el-col :span="12">
        <div class="grid-content">
          <span class="grid-lable">结算状态：</span>
          <span class="grid-value">{{ formModel.sureStatus || "无" }}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content">
          <span class="grid-lable">业务交易流水号：</span>
          <span class="grid-value">{{ formModel.miTradeNo || "无" }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="grid-content">
          <span class="grid-lable">本地结算流水号：</span>
          <span class="grid-value">{{ formModel.billNo || "无" }}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content">
          <span class="grid-lable">医院就诊流水号：</span>
          <span class="grid-value">{{ formModel.visitNo || "无" }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="grid-content">
          <span class="grid-lable">医保结算流水号：</span>
          <span class="grid-value">{{ formModel.settleSerialNo || "无" }}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content">
          <span class="grid-lable">业务周期号：</span>
          <span class="grid-value">{{ formModel.bizCycleNo || "无" }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div class="grid-content">
          <span class="grid-lable">原始业务订单号：</span>
          <span class="grid-value">{{
            formModel.originBizOrderNo || "无"
          }}</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content">
          <span class="grid-lable">支付业务订单号：</span>
          <span class="grid-value">{{ formModel.bizOrderNo || "无" }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div class="grid-content">
          <span class="grid-lable">失败原因：</span>
          <span class="grid-value-block">{{
            formModel.settleFailMsg || "无"
          }}</span>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-if="formModel.tradeType === 1" :span="12">
        <div class="grid-content">
          <span class="grid-lable">结算时间：</span>
          <span class="grid-value">{{
            this.$common.timeFormat(formModel.settleDate, "YYYY-MM-DD HH:mm:ss")
          }}</span>
        </div>
      </el-col>
      <el-col v-if="formModel.tradeType === -1" :span="12">
        <div class="grid-content">
          <span class="grid-lable">退款时间：</span>
          <span class="grid-value">{{
            this.$common.timeFormat(formModel.settleDate, "YYYY-MM-DD HH:mm:ss")
          }}</span>
        </div>
      </el-col>
    </el-row>
    <div v-if="formModel.extendData" class="flow-title">
      <span class="title-block" />
      <span class="title-text">结算详情</span>
    </div>
    <el-form ref="settlementFlowThree" label-width="180px" :inline="true">
      <el-form-item
        v-for="(details, index) in formModel.extendData"
        :key="index"
        :label="details.label + '：'"
      >
        {{ details.value }}
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose"> 取消 </el-button>
    </div>
  </v-dialog>
</template>

<script>
import dialogFormMixin from "@/mixins/dialogFormMixin";
import { mapGetters } from "vuex";

export default {
  mixins: [dialogFormMixin],
  data() {
    return {
      formModel: {
        id: null,
        userName: null,
        patientId: null,
        miCenterName: null,
        hopsName: null,
        sureStatus: null,
        miTradeNo: null,
        billNo: null,
        visitNo: null,
        settleSerialNo: null,
        bizCycleNo: null,
        originBizOrderNo: null,
        bizOrderNo: null,
        settleFailMsg: null,
        settleDate: null,
        extendData: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      sureStatus: "sureStatus",
    }),
  },
  watch: {
    rowData(newVal) {
      if (newVal && typeof newVal === "object") {
        Object.keys(this.formModel).forEach((key) => {
          this.formModel[key] = newVal[key];
          this.cacheRow[key] = newVal[key];
        });
        this.sureStatus.forEach((item) => {
          if (parseInt(item.code) === newVal.sureStatus) {
            this.formModel.sureStatus = item.value;
          }
        });
        if (newVal.extendData !== null) {
          const newArr = [];
          Object.keys(JSON.parse(newVal.extendData)).forEach((keys) => {
            const newObj = {
              label: keys,
              value: JSON.parse(newVal.extendData)[keys],
            };
            newArr.push(newObj);
          });
          this.formModel.extendData = newArr;
        } else {
          this.formModel.extendData = null;
        }
      }
      this.handleEditable(!!this.formModel.id);
    },
  },
  methods: {
    handleResetForm() {
      this.$nextTick(() => {
        this.$eventBus.$emit("dialog-visible", {
          visible: false,
          dialogId: "settlementFlow",
        });
      });
    },
    handleClose() {
      this.$emit("dialog-close");
      this.$eventBus.$emit("dialog-visible", false);
    },
  },
};
</script>
<style lang="less" scoped>
.grid-content {
  display: flex;
  align-items: flex-start;
  .grid-lable {
    display: block;
    width: 120px;
    font-size: 14px;
    line-height: 32px;
    color: #5b697f;
    text-align: right;
  }
  .grid-value {
    display: block;
    font-size: 14px;
    line-height: 32px;
    color: #5b697f;
  }
  .grid-value-block {
    display: block;
    width: 570px;
    font-size: 14px;
    line-height: 32px;
    color: #5b697f;
  }
}

.flow-title {
  margin-bottom: 10px;
}
</style>
