/*
 * @Author: 张淦
 * @Date: 2019-12-09 16:59:16
 * @LastEditors: zhanggan
 * @Description: 商户2.0
 * @FilePath: /gpay-ops-static/src/store/state.js
 */
export default {
  // 清算分账
  accountList: [],
  channelList: [],
  bankList: [],
  payConfigList: [],

  // 商户系统
  roleList: [],
  dictionaryList: [],
  companyList: [],
  financeList: [],
  bizInvoiceList: [],
  businessList: [],
  currencyList: [],
  businessAdministration: [],
  paymentAccountList: [],
  merchantAllChannel: [],
  merchantChannelList: [],
  merchantList: [],
  permissionsList: [],
  timeNumber: "",
  auditStatus: {
    step: null,
    status: "",
    style: null,
    from: null,
  },
  businessLine: [],
  payWayList: [],
  orderStatus: [],
  refundStatus: [],
  callBackStatus: [],
  otherChannelList: [],
  // 收款账号
  accountNo: "",

  // fetch loading
  effectLoading: {},

  // dialog Visible
  dialogStatus: {
    visible: false,
    dialogId: "",
  },

  // 账号信息和支付信息
  accountChannel: {},
  paymentChannel: {},
  configureList: [],

  // 用户角色
  userRoles: [],

  // 上传预览
  dialogPreviewStatus: {
    visible: false,
    fileName: "",
    fileUrl: "",
  },
  // 对账-业务类型列表
  bizCategory: [],

  // 发票系统
  enterpriseList: [],

  // 医保后台
  hospitalDetail: [],
  medicalTypeList: [],
  sureStatus: [],
  medicalCenterList: [],
  bindCardWhiteList: [],
  certificatesList: [],
  doctorList: [],
  departmentList: [],
  exportList: [],
  partnerList: [],
  fundStatistics: {},
  channelConfigList: [],

  // 健康账户后台
  HAChannel: [],
  HACodeList: [],

  // 对账 - 结算账户
  checkingAccountList: [],
  allInstitution: [],
};
