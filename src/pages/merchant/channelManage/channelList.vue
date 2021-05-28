<template>
  <div class="finance-summary">
    <el-form
      ref="channelListForm"
      label-width="96px"
      :inline="true"
      :model="searchForm"
    >
      <el-form-item prop="payWayCode">
        <el-select
          v-model="searchForm.payWayCode"
          placeholder="渠道"
          filterable
          clearable
        >
          <el-option
            v-for="channel in merchantChannelList"
            :key="channel.id"
            :label="channel.payWayName"
            :value="channel.payWayCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="payWayStatus">
        <el-select
          v-model="searchForm.payWayStatus"
          placeholder="渠道状态"
          filterable
          clearable
        >
          <el-option
            v-for="(value, key) in availableState"
            :key="key"
            :label="value"
            :value="key"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="applyDate">
        <we-date-picker
          v-model="applyDate"
          :picker-props="applyPickerProps"
          :default-range="0"
          @currentChange="applyDatePickerChange"
        />
      </el-form-item>
      <el-form-item prop="modifyDate">
        <we-date-picker
          v-model="modifyDate"
          :picker-props="modifyPickerProps"
          :default-range="0"
          @currentChange="modifyDatePickerChange"
        />
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
        <v-form-reset :form-ref="$refs['channelListForm']" />
      </el-form-item>
    </el-form>
    <v-add-btn @click="handleInfo({}, 'channelDialog')"> 新增渠道 </v-add-btn>
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <channel-dialog :row-data="row" />
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import { AVAILABLE_STATE, AVAILABLE_STATE_ARR } from '@/utils/constants';
import tableFormMixin from '@/mixins/tableFormMixin';
import prohibitMixin from '@/mixins/prohibitMixin';
import channelDialog from './component/channelDialog';

export default {
  components: {
    'channel-dialog': channelDialog,
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.columns = this.getColumns();
    this.availableState = AVAILABLE_STATE;
    this.queryUrl = '/pay/channel/query.json';
    this.prohibitArr = [
      {
        url: '/pay/channel/disable.json',
        message: '禁用'
      },
      {
        url: '/pay/channel/enable.json',
        message: '启用'
      },
    ];
    this.applyPickerProps = {
      startPlaceholder: '创建开始时间',
      endPlaceholder: '创建结束时间',
    };
    this.modifyPickerProps = {
      startPlaceholder: '操作开始时间',
      endPlaceholder: '操作结束时间',
    };
    return {
      applyDate: [],
      modifyDate: [],
      // 搜索form
      searchForm: {
        payWayCode: null,
        payWayStatus: null,
        startDate: null,
        endDate: null,
        modifyStartDate: null,
        modifyEndDate: null,
      },
    };
  },
  computed: {
    ...mapGetters({
      merchantChannelList: 'merchantChannelList',
      currencyList: 'currencyList'
    }),
  },
  created() {
    this.$common.judgeState({
      merchantChannelList: 'getMerchantAllChannelList',
      currencyList: 'getCurrencyList'
    });
  },
  methods: {
    getColumns() {
      return [
        { prop: 'payWayName', label: '渠道名称', width: '100' },
        { prop: 'payWayCode', label: '渠道编码', width: '100' },
        { prop: 'icon',
          label: '渠道图标',
          width: '100',
          render: (h, value, row) => {
            return (
              <img src={value} width="35px" />
            );
          },
        },
        { prop: 'dictCurrency', label: '币种', width: '140'},
        { prop: 'rate', label: '渠道汇率', width: '100'},
        { prop: 'copy', label: '渠道运营文案', width: '200'},
        { prop: 'tag',
          label: '渠道标签',
          width: '100',
          render: (h, value, row) => {
            return (
              <img src={value} width="35px" />
            );
          },
        },
        { prop: 'payWayStatus',
          label: '渠道状态',
          render: (h, value, row) => {
            return (
              <span class="status-flex">
                <span class={AVAILABLE_STATE_ARR[value].className}></span>
                <span>{AVAILABLE_STATE_ARR[value].text}</span>
              </span>
            );
          },
        },
        { prop: 'createDate',
          label: '创建时间',
          width: '210',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          },
        },
        { prop: 'modifyDate',
          label: '操作时间',
          width: '210',
          render: (h, value, row) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          },
        },
        { prop: 'creator', label: '操作人', width: '100'},
        { prop: 'remark', label: '备注', width: '150'},
        { prop: 'payWayStatus',
          label: '操作',
          width: '100',
          fixed: 'right',
          render: (h, value, row) => {
            const html = ['禁用', '启用'];
            return (
              <div>
                <el-button onClick={() => this.handleInfo(row, 'channelDialog')} type="text">详情</el-button>
                <el-button onClick={() => this.handleProhibit(row.id, value, '渠道')} type="text">{html[value]}</el-button>
              </div>
            );
          }
        }
      ];
    },
    applyDatePickerChange(datePicker) {
      this.searchForm.startDate = datePicker ? datePicker[0] : '';
      this.searchForm.endDate = datePicker ? datePicker[1] : '';
    },
    modifyDatePickerChange(datePicker) {
      this.searchForm.modifyStartDate = datePicker ? datePicker[0] : '';
      this.searchForm.modifyEndDate = datePicker ? datePicker[1] : '';
    },
    formatMoneyType(key) {
      let name = '';
      this.currencyList.forEach(cur => {
        if (cur.code === key) {
          name = cur.name;
        }
      });
      return name;
    },
  }
};
</script>
