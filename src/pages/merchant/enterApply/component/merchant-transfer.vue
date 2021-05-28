<template>
  <div class="transfer-row">
    <div class="transfer-col">
      <div class="transfer-title">
        <span>可选支付方式</span>
        <el-button
          v-if="payStyle === 1"
          type="primary"
          :disabled="disableTransfer"
          @click="addWX"
        >
          添加微信应用
        </el-button>
      </div>
      <draggable
        class="transfer-list"
        :list="optionalList"
        :disabled="enabled"
        group="people"
      >
        <div
          v-for="(element, index) in optionalList"
          :key="index"
          class="transfer-list-item clear"
        >
          <div
            v-show="!element.isSetting || !element.accountNo"
            @mouseover="enabled = true"
          >
            <div class="transfer-icon">
              <i class="el-icon-s-unfold" />
            </div>
            <div class="item-left">
              <p class="item-left-title">
                {{ element.payWayName }}
                ({{ element.productName }})
              </p>
              <p v-show="element.accountNo">
                {{ element.accountNo }}
              </p>
              <p v-show="element.payWayCode">
                {{ element.payWayCode }}
              </p>
            </div>
            <div class="item-right">
              <p>参数未配置</p>
              <el-button
                type="text"
                :disabled="disableTransfer"
                @click="setting(element, index)"
              >
                点击配置
              </el-button>
            </div>
          </div>
          <div
            v-show="element.isSetting && element.accountNo"
            @mouseover="enabled = false"
          >
            <div class="transfer-icon">
              <i class="el-icon-s-fold" />
            </div>
            <div class="item-left">
              <p class="item-left-title">
                {{ element.payWayName }}
                ({{ element.productName }})
              </p>
              <p v-show="element.accountNo">
                {{ element.accountNo }}
              </p>
              <p v-show="element.payWayCode">
                {{ element.payWayCode }}
              </p>
            </div>
            <div class="item-right" style="padding: 0 13px">
              <el-button type="text" @click="setting(element, index)">
                详 情
              </el-button>
            </div>
          </div>
        </div>
      </draggable>
    </div>
    <div class="transfer-col">
      <div class="transfer-title">
        <span>已选支付方式</span>
      </div>
      <draggable
        class="transfer-list"
        :list="selectedList"
        group="people"
        @change="change"
      >
        <div
          v-for="(element, index) in selectedList"
          :key="index"
          class="transfer-list-item clear"
          @mouseover="enabled = false"
        >
          <div class="transfer-icon">
            <i class="el-icon-s-fold" />
          </div>
          <div class="item-left">
            <p class="item-left-title">
              {{ element.payWayName }}
              ({{ element.productName }})
            </p>
            <p v-show="element.accountNo">
              {{ element.accountNo }}
            </p>
            <p v-show="element.payWayCode">
              {{ element.payWayCode }}
            </p>
          </div>
          <div class="item-right">
            <el-button type="text" @click="setting(element, index, true)">
              详情
            </el-button>
          </div>
        </div>
      </draggable>
    </div>
    <addwx-dialog
      :wx-dialog-visible="wxDialogVisible"
      @addWeChatApplication="addWeChatApplication"
    />
    <add-setting-dialog
      :setting-dialog-visible="settingDialogVisible"
      :edit-style="editStyle"
      :row="row"
      @handleSettingAdd="handleSettingAdd"
    />
  </div>
</template>

<script>
import addwxDialog from "@/components/enterApply/addwxDialog";
import addSettingDialog from "@/components/enterApply/addSettingDialog";
import draggable from "vuedraggable";

export default {
  name: "VFormTransfer",
  components: {
    draggable,
    "addwx-dialog": addwxDialog,
    "add-setting-dialog": addSettingDialog,
  },
  props: {
    myStyle: {
      type: String,
      default: "",
    },
    payWayVOS: {
      type: Array,
      default: () => [],
    },
    settingList: {
      type: Array,
      default: () => [],
    },
    disableTransfer: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      enabled: true,
      payStyle: null,
      optionalList: [],
      selectedList: [],
      isSettingList: [],
      row: {},
      editStyle: false,
      // dialog
      wxDialogVisible: false,
      settingDialogVisible: false,
    };
  },
  watch: {
    payWayVOS: {
      handler(newValue) {
        if (newValue) {
          const selectedList = [];
          newValue.forEach((element) => {
            if (element.accountNo !== "99") {
              selectedList.push({ ...element, isSetting: true });
            }
          });
          this.selectedList = selectedList;
          this.$emit("addPayWayVOS", this.selectedList);
        }
      },
      immediate: true,
    },
    settingList: {
      handler(newValue) {
        const optionalList = [];
        newValue.forEach((element) => {
          if (
            element.sceneType === this.payStyle ||
            (element.accountNo === "99" && element.sceneType === this.payStyle)
          ) {
            optionalList.push({
              ...element,
              accountNo: element.accountNo === "99" ? "" : element.accountNo,
            });
          }
        });
        this.optionalList = optionalList;
      },
    },
  },
  updated() {
    // console.log(this.enabled);
    // console.log(this.selectedList);
  },
  created() {
    if (this.myStyle === "h5") {
      this.payStyle = 1;
    } else if (this.myStyle === "web") {
      this.payStyle = 2;
    }
  },
  methods: {
    addWX() {
      this.wxDialogVisible = true;
    },
    addWeChatApplication(res) {
      this.optionalList.push(res);
    },
    handleSettingAdd(res) {
      this.optionalList[res.payWayOrder] = {
        accountPayInfoVO: res,
        isSetting: true,
        accountNo: res.accountNo,
        ...this.optionalList[res.payWayOrder],
      };
    },
    setting(row, index, editStyle = false) {
      this.row = { ...row, payWayOrder: index, editStyle };
      this.settingDialogVisible = true;
    },
    change() {
      if (this.selectedList) {
        this.selectedList.forEach((element, index) => {
          element.payWayOrder = index;
        });
      }
      this.$emit("addPayWayVOS", this.selectedList);
    },
    closeDialog() {
      this.settingDialogVisible = false;
      this.wxDialogVisible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.clear::after {
  display: block;
  clear: both;
  content: "";
}
.transfer-row {
  width: 710px;
  .transfer-col {
    display: inline-block;
    width: 320px;
    margin-right: 30px;
  }
}
.transfer-title {
  padding: 10px 0 10px 15px;
  margin: 0;
  line-height: 40px;
  color: #000;
  background: #f5f7fa;
  border: 1px solid #ebeef5;
  border-radius: 4px 4px 0 0;
  box-sizing: border-box;
  span {
    margin-right: 30px;
    font-size: 16px;
    color: #303133;
  }
}
.transfer-list {
  height: 440px;
  overflow-y: scroll;
  border: 1px solid #ebeef5;
  border-radius: 0 0 4px 4px;
}
.transfer-list-item {
  padding: 10px;
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.125);
  .transfer-icon {
    float: left;
    margin-top: 4px;
    margin-right: 10px;
    font-size: 26px;
  }
  .item-left {
    float: left;
    p {
      font-size: 12px;
      color: #c0c4cc;
    }
    .item-left-title {
      font-size: 14px;
      color: #606266;
    }
  }
  .item-center {
    float: right;
    p {
      font-size: 12px;
      color: #f35e5e;
    }
  }
  .item-right {
    float: right;
  }
}
</style>
