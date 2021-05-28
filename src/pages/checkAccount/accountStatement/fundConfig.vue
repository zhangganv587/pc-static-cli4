<!--
 * @Author: zhanggan
 * @Date: 2020-10-20 18:14:01
 * @LastEditors: zhanggan
 * @Description: 对账管理 - 渠道账号配置
 * @FilePath: /gpay-ops-static/src/pages/checkAccount/accountStatement/fundConfig.vue
-->
<template>
  <div class="page-fund-config">
    <el-form ref="form" label-width="120px" :inline="true" :model="formModel">
      <el-form-item prop="accountNo">
        <el-input
          v-model="formModel.accountNo"
          clearable
          placeholder="收款账号"
        />
      </el-form-item>
      <el-form-item prop="payWayCode">
        <el-select
          v-model="formModel.payWayCode"
          clearable
          placeholder="支付渠道"
        >
          <el-option
            v-for="item in ACCOUNT_CHANNEL_LIST"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-select v-model="formModel.status" clearable placeholder="账号状态">
          <el-option
            v-for="item in ACCOUNT_STATUS_LIST"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item prop="hasJoined">
        <el-select
          v-model="formModel.hasJoined"
          clearable
          placeholder="是否加入资金对账"
        >
          <el-option
            v-for="item in HAS_JOINED"
            :key="item.key"
            :label="item.value"
            :value="item.key"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-bunch>
          <el-button type="primary" @click="handleSearch"> 查询 </el-button>
          <el-button plain @click="handleReset"> 清空 </el-button>
        </el-bunch>
      </el-form-item>
    </el-form>
    <div v-loading="loading" class="list">
      <el-table :data="tableData" size="large" border>
        <el-table-column type="index" label="序号" width="60" align="center" />
        <el-table-column prop="payWayName" label="支付渠道" width="120" />
        <el-table-column prop="payWayCode" label="支付方式" width="150" />
        <el-table-column prop="accountNo" label="收款账号" width="180" />
        <el-table-column prop="companyName" label="账号主体" />
        <el-table-column
          prop="payWayStatus"
          label="账号状态"
          width="100"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-tag v-if="row.payWayStatus === 0" type="success"> 启用 </el-tag>
            <el-tag v-if="row.payWayStatus === 1" type="logger">
              未启用
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="hasJoined"
          label="是否加入资金对账"
          width="160"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-checkbox
              v-model="row.hasJoined"
              @change="
                (val) => {
                  handleJoin(row, val);
                }
              "
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          label="操作"
          width="120"
          fixed="right"
          align="center"
        >
          <template slot-scope="{ row }">
            <el-link
              :href="`/channel/collectionList?card=five&accountNo=${row.accountNo}&payWayCode=${row.payWayCode}`"
              type="primary"
            >
              查看使用机构
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        align="right"
        layout="total, prev, pager, next, sizes, jumper"
        :total="totalSize"
        :current-page.sync="pagination.pageIndex"
        @current-change="handlePageNo"
        @size-change="handlePageSize"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { debounce } from "throttle-debounce";
export default {
  data() {
    this.ACCOUNT_CHANNEL_LIST = [
      { key: "wxpay", value: "微信支付" },
      { key: "alipay", value: "支付宝支付" },
      { key: "wybank", value: "健康账户支付" },
    ];
    this.ACCOUNT_STATUS_LIST = [
      { key: 0, value: "启用" },
      { key: 1, value: "禁用" },
    ];
    this.HAS_JOINED = [
      { key: 0, value: "已加入资金对账" },
      { key: 1, value: "未加入资金对账" },
    ];
    return {
      formModel: {
        accountNo: null, // 收款账号
        payWayCode: null, // 支付渠道
        status: null, // 账号状态
        hasJoined: null, // 是否加入资金对账
      },
      pagination: {
        pageIndex: 1,
        pageSize: 10,
      },
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      channelConfigList: "channelConfigList",
    }),
    tableData() {
      return this.channelConfigList.dataList;
    },
    totalSize() {
      return this.channelConfigList.totalNum;
    },
  },
  created() {
    this.debounceSearch = debounce(100, this.handleSearch);
    this.debounceSearch();
  },
  mounted() {
    this.debounceSearch();
  },
  methods: {
    ...mapActions({
      getChannelConfigList: "getChannelConfigList",
      postChannelConfigUpdate: "postChannelConfigUpdate",
    }),
    handleSearch(reset) {
      if (reset) {
        this.pagination.pageIndex = 1;
      }
      const query = {
        ...this.formModel,
        ...this.pagination,
      };
      this.loading = true;
      this.getChannelConfigList(query).finally(() => {
        this.loading = false;
      });
    },
    handlePageNo(val) {
      this.pagination.pageIndex = val;
      this.debounceSearch();
    },
    handlePageSize(val) {
      this.pagination.pageSize = val;
      this.debounceSearch();
    },
    handleReset() {
      this.$refs.form.resetFields();
      this.pagination = {
        pageIndex: 1,
        pageSize: 10,
      };
      this.debounceSearch();
    },
    handleJoin(row, joined) {
      const { payWayCode, accountNo: channelAccountNo } = row;
      this.loading = true;
      this.postChannelConfigUpdate({
        payWayCode,
        channelAccountNo,
        joinStatus: joined ? 0 : 1,
      })
        .then((res) => {
          if (typeof res === "boolean" && res) {
            this.$message({
              type: "success",
              message: "修改成功",
            });
          } else {
            this.$message({
              type: "error",
              message: "修改失败",
            });
          }
        })
        .finally(() => {
          this.loading = false;
          this.debounceSearch();
        });
    },
  },
};
</script>
<style lang="less" scoped>
.page-fund-config {
  .pagination {
    padding: 16px 0px;
  }
}
</style>
