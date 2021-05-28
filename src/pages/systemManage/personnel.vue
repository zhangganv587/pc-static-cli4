<template>
  <div class="personnel">
    <div class="serchBox">
      <el-form
        ref="personnelForm"
        label-width="92px"
        :inline="true"
        :model="searchForm"
      >
        <el-row>
          <el-form-item label="状态：" prop="status">
            <el-select
              v-model="searchForm.status"
              placeholder="请选择状态"
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
          <el-form-item label="角色：" prop="role">
            <el-select
              v-model="searchForm.role"
              placeholder="请选择角色"
              filterable
              clearable
            >
              <el-option
                v-for="item in roleList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="用户名：" prop="userName">
            <el-input
              v-model="searchForm.userName"
              placeholder="请输入用户名"
              clearable
            />
          </el-form-item>
          <el-form-item label="OA账号：" prop="staffNo">
            <el-input
              v-model="searchForm.staffNo"
              placeholder="请输入OA账号"
              clearable
            />
          </el-form-item>
          <el-form-item label="创建时间：" prop="rangeData">
            <we-date-picker
              v-model="searchForm.rangeData"
              @currentChange="dateChangePicker"
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
            <v-form-reset :form-ref="$refs['personnelForm']" />
          </el-form-item>
        </el-row>
      </el-form>
    </div>
    <v-add-btn @click="handleInfo({}, 'personnelInfo')"> 新增人员 </v-add-btn>
    <v-table
      v-loading="loading"
      :data="tableData"
      :columns="columns"
      :pagination="pagination"
      @currentChange="currentChange"
    />
    <personnel-info :row-data="row" />
  </div>
</template>

<script type="text/jsx">
import { mapGetters } from 'vuex';
import personnelInfo from './component/personnelInfo';
import { AVAILABLE_STATE, DICT_STATUS } from '@/utils/constants.js';
import tableFormMixin from '@/mixins/tableFormMixin';
import prohibitMixin from '@/mixins/prohibitMixin';

export default {
  components: {
    personnelInfo,
  },
  mixins: [tableFormMixin, prohibitMixin],
  data() {
    this.availableState = AVAILABLE_STATE;
    this.columns = this.getColumns();
    this.queryUrl = '/rule/query.json';
    this.prohibitArr = [
      {
        url: '/rule/disable.json',
        message: '禁用'
      },
      {
        url: '/rule/enable.json',
        message: '启用'
      },
    ];

    return {
      searchForm: { // 搜索form
        status: '',
        role: '',
        userName: '',
        staffNo: '',
        rangeData: [],
        startDate: '',
        endDate: ''
      },
    };
  },
  computed: {
    ...mapGetters({
      roleList: 'roleList',
      effectLoading: 'effectLoading'
    }),
  },
  created() {
    this.$common.judgeState({
      roleList: 'getRoleList',
      businessAdministration: 'getBusinessAdministration'
    });
  },
  mounted() {
    console.log(this.$options.computed.effectLoading.name);
    // this.handleSearch();
  },
  methods: {
    getColumns() {
      return [
        { prop: 'userName', label: '用户名' },
        { prop: 'role',
          label: '角色',
          render: (h, value) => {
            if (value === '游客') {
              return (
                <p>{value}（<a href="http://user.guahao-test.com/main/main">去申请权限</a>）</p>
              );
            } else {
              return <p>{value}</p>;
            }
          }
        },
        { prop: 'groupId', label: 'OA账号' },
        { prop: 'def', label: '管理业务' },
        { prop: 'creator', label: '操作人' },
        { prop: 'status',
          label: '状态',
          render: (h, value) => {
            return (
              <span class="status-flex">
                <span class={AVAILABLE_STATE[value].className}></span>
                <span>{AVAILABLE_STATE[value].text}</span>
              </span>
            );
          }
        },
        { prop: 'gmtCreated',
          label: '创建时间',
          render: (h, value) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: 'gmtModified',
          label: '操作时间',
          render: (h, value) => {
            return this.$common.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
          }
        },
        { prop: 'memo', label: '备注' },
        { prop: 'status',
          label: '操作',
          width: '100',
          fixed: 'right',
          render: (h, value, row) => {
            return (
              <div>
                <el-button onClick={() => this.handleInfo(row, 'personnelInfo')} type="text">详情</el-button>
                <el-button onClick={() => this.handleProhibit(row.id, value, '人员')} type="text">{DICT_STATUS[value]}</el-button>
              </div>
            );
          }
        }
      ];
    },
    dateChangePicker(datePicker) {
      this.searchForm.startDate = datePicker ? datePicker[0] : '';
      this.searchForm.endDate = datePicker ? datePicker[1] : '';
    },
  }
};
</script>
