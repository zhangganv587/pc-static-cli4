<!--
 * @Author: 张淦
 * @Date: 2020-06-09 14:27:22
 * @LastEditors: zhanggan
 * @Description: 对账管理 - 医保账单文件
 * @FilePath: /gpay-ops-static/src/pages/checkAccount/accountFileManage/insuranceStatementFile.vue
-->
<template>
  <div class="insureFileForm">
    <div class="serchBox">
      <el-form
        ref="insureFileForm"
        label-width="92px"
        :inline="true"
        :model="searchForm"
        :rules="rules"
      >
        <el-form-item prop="rangeData">
          <we-date-picker
            v-model="rangeData"
            :picker-props="pickerProps"
            :default-range="30"
            :max-range="31"
            @currentChange="applyDatePickerChange"
          />
        </el-form-item>
        <el-form-item prop="accountName">
          <el-autocomplete
            v-model="searchForm.accountName"
            popper-class="my-autocomplete"
            :fetch-suggestions="accountQuerySearch"
            placeholder="医保名称"
            @select="handleAccountSelect"
          >
            <template slot-scope="{ item }">
              {{ item.channelAccountName }}
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item prop="partnerName">
          <el-autocomplete
            v-model="searchForm.partnerName"
            popper-class="my-autocomplete"
            :fetch-suggestions="partnerQuerySearch"
            placeholder="机构名称"
            @select="handlePartnerSelect"
          >
            <template slot-scope="{ item }">
              {{ item.channelPartnerName }}
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item prop="recodeStatus">
          <el-select
            v-model="searchForm.recodeStatus"
            clearable
            placeholder="导入状态"
          >
            <el-option
              v-for="(value, key) in RECODE_STATUS"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <v-form-submit
            ref="formSubmit"
            :action="queryUrl"
            :immediate="true"
            :pagination="pagination"
            @click:search="handleSearch"
          >
            查询
          </v-form-submit>
          <v-form-reset :form-ref="$refs['insureFileForm']" />
        </el-form-item>
      </el-form>
    </div>
    <v-add-btn @click="handleInfo({}, 'uploadStatementFile')">
      上传账单文件
    </v-add-btn>
    <v-table
      v-loading="loading"
      type="index"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <statementFileDialog />
  </div>
</template>

<script type="text/jsx">
import statementFileDialog from '../component/statementFileDialog';
import tableFormMixin from '@/mixins/tableFormMixin';
import { RECODE_STATUS, METHOD_STATUS } from '@/utils/constants';

export default {
  components: {
    statementFileDialog
  },
  mixins: [tableFormMixin],
  data() {
    this.columns = this.getColumns();
    this.queryUrl = '/bill/gpay.json';
    this.pickerProps = {
      startPlaceholder: '对账开始时间',
      endPlaceholder: '对账结束时间',
    };
    this.RECODE_STATUS = RECODE_STATUS;
    this.METHOD_STATUS = METHOD_STATUS;
    var validateDate = (rule, value, callback) => {
      console.log(this.searchForm.accountTimeStart);
      if (!this.searchForm.accountTimeStart) {
        callback(new Error('时间不能为空！'));
      } else {
        callback();
      }
    };
    return {
      rangeData: [],
      channelList: [],
      // 搜索form
      searchForm: {
        accountName: null,
        partnerName: null,
        recodeStatus: null,
        accountTimeStart: null,
        accountTimeEnd: null,
        accountChannelList: [6]
      },
      rules: {
        rangeData: [
          { validator: validateDate, trigger: ['change', 'blur'] }
        ],
      },
    };
  },
  mounted() {
    this.getChannelList();
  },
  methods: {
    getChannelList() {
      this.$fetch('/bill/search_channel.json', {
        method: 'post',
      }).then(res => {
        if (res.code === 0) {
          this.channelList = res.data;
        }
      });
      this.$fetch('bill/search_channel_account', {
        method: 'post',
      }).then(res => {
        if (res.code === 0) {
          this.accountList = res.data;
        }
      });
    },
    accountQuerySearch(queryString, cb) { // 查询是否存在该渠道
      var restaurants = this.accountList;
      var results = queryString ? restaurants.filter(this.accountCreateFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    accountCreateFilter(queryString) {
      return (restaurant) => {
        return (restaurant.channelAccountName.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
      };
    },
    handleAccountSelect(item) { // 选择已有的医保中心
      this.searchForm.accountName = item.channelAccountName;
    },
    partnerQuerySearch(queryString, cb) { // 查询是否存在该机构
      var restaurants = this.channelList;
      var results = queryString ? restaurants.filter(this.partnerCreateFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    partnerCreateFilter(queryString) {
      return (restaurant) => {
        return (restaurant.channelPartnerName.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
      };
    },
    handlePartnerSelect(item) { // 选择已有的机构
      this.searchForm.partnerName = item.channelPartnerName;
    },
    getColumns() {
      return [
        { prop: 'accountTime', label: '对账单日期' },
        { prop: 'accountName', label: '医保中心' },
        { prop: 'partnerName', label: '机构名称' },
        { prop: 'fileSuffix', label: '文件类型'},
        { prop: 'fileName', label: '文件名称' },
        { prop: 'remark', label: '备注' },
        { prop: 'method',
          label: '上传方式',
          render: (h, value, row) => {
            return METHOD_STATUS[value];
          }
        },
        { prop: 'recodeStatus',
          label: '导入状态',
          render: (h, value, row) => {
            return RECODE_STATUS[value];
          }
        },
        { prop: 'dictValue', label: '失败原因' },
        { prop: 'filePath',
          label: '操作',
          width: '100',
          fixed: 'right',
          render: (h, value, row) => {
            return (
              <div>
                {
                  value &&
                  <el-button onClick={() => this.handleDownload(value)} type="text">下载</el-button>
                }
              </div>
            );
          }
        }
      ];
    },
    applyDatePickerChange(datePicker) {
      this.searchForm.accountTimeStart = datePicker ? (new Date(datePicker[0])).getTime() : '';
      this.searchForm.accountTimeEnd = datePicker ? (new Date(datePicker[1])).getTime() : '';
    },
    handleDownload(value) {
      location.href = value;
    }
  }
};
</script>
