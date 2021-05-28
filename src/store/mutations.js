/*
 * @Author: 张淦
 * @Date: 2019-12-13 10:11:53
 * @LastEditors: zhanggan
 * @Description: 商户2.0
 * @FilePath: /gpay-ops-static/src/store/mutations.js
 */
import types from "./types";

export default {
  [types.GET_ACCOUNT_LIST](state, data) {
    state.accountList = data;
  },
  [types.GET_CHANNEL_LIST](state, data) {
    state.channelList = data;
  },
  [types.GET_BANK_LIST](state, data) {
    state.bankList = data;
  },
  [types.GET_PAYCONFIG_LIST](state, data) {
    state.payConfigList = data.condition;
  },
  [types.EFFECT_LOADING](state, data) {
    state.effectLoading = {
      ...state.effectLoading,
      [data.fetchUrl]: data.loadStatus,
    };
  },
  [types.DIALOG_VISIBLE](state, data) {
    if (typeof data === "boolean") {
      if (
        process.env.NODE_ENV === "development" &&
        !state.dialogStatus.dialogId
      ) {
        console.warn(
          `[vuex mutations] '${types.DIALOG_VISIBLE}': It is best to set the 'dialogId' parameter`
        );
      }

      state.dialogStatus = {
        ...state.dialogStatus,
        visible: data,
      };
    } else if (data && typeof data === "object") {
      state.dialogStatus = {
        ...state.dialogStatus,
        ...data,
      };
    } else {
      console.error(
        `[vuex mutations] '${
          types.DIALOG_VISIBLE
        }': Unsupported pass parameter "${String(data)}"`
      );
    }
  },
  [types.GET_ROLE_LIST](state, data) {
    state.roleList = data;
  },
  [types.GET_DICTIONARY_LIST](state, data) {
    state.dictionaryList = data;
  },
  [types.GET_COMPANY_LIST](state, data) {
    state.companyList = data;
  },
  [types.GET_FINANCE_LIST](state, data) {
    state.financeList = data;
  },
  [types.GET_BIZ_INVOICE](state, data) {
    state.bizInvoiceList = data.dataList;
  },
  [types.GET_BUSINESS_LIST](state, data) {
    state.businessList = data.dataList;
  },
  [types.GET_CURRENCY_LIST](state, data) {
    state.currencyList = data.dataList;
  },
  [types.GET_BUSINESS_ADMINISTRATION_LIST](state, data) {
    state.businessAdministration = data.dataList;
  },
  [types.GET_PAYMENT_ACCOUNT_LIST](state, data) {
    state.paymentAccountList = data.dataList;
  },
  [types.GET_MERCHANT_ALL_CHANNEL](state, data) {
    state.merchantAllChannel = data;
  },
  [types.GET_MERCHANT_CHANNEL_LIST](state, data) {
    state.merchantChannelList = data;
  },
  [types.GET_MERCHANT_LIST](state, data) {
    state.merchantList = data.dataList;
  },
  [types.ACCOUNT_CHANNEL](state, data) {
    state.accountChannel = data;
  },
  [types.PAYMENT_CHANNEL](state, data) {
    state.paymentChannel = data;
  },
  [types.CONFIGURE_LIST](state, data) {
    state.configureList = data;
  },
  [types.GET_BUSINESS_NUMBER](state, data) {
    state.businessNumber = data;
  },
  [types.GET_TIME_NUMBER](state, data) {
    state.timeNumber = data.num;
  },
  [types.USER_ROLES](state, data) {
    if (typeof data === "string") {
      data = data.split(",");
    } else if (!Array.isArray(data)) {
      data = [];
    }

    state.userRoles = data;
  },

  [types.DIALOG_PREVIEW_STATUS](state, data) {
    let newState = { ...state.dialogPreviewStatus };

    if (typeof data === "boolean") {
      newState.visible = data;
    } else if (data && typeof data === "object") {
      newState = {
        ...newState,
        ...data,
      };
    }

    state.dialogPreviewStatus = newState;
  },
  [types.GET_ADUIT_STATUS](state, data) {
    state.auditStatus = data;
  },
  [types.GET_BUSINESS_LINE](state, data) {
    state.businessLine = data.dataList;
  },
  [types.GET_PAYWAY_LIST](state, data) {
    state.payWayList = data;
  },
  [types.GET_ORDER_STATUS](state, data) {
    state.orderStatus = data;
  },
  [types.GET_REFUND_STATUS](state, data) {
    state.refundStatus = data;
  },
  [types.GET_CALLBACK_STATUS](state, data) {
    state.callBackStatus = data;
  },
  [types.GET_BIZ_CATEGORY](state, data) {
    state.bizCategory = data;
  },
  [types.GET_ENTERPRISE_LIST](state, data) {
    state.enterpriseList = data;
  },
  [types.GET_HOSPITAL_DETAIL](state, data) {
    state.hospitalDetail = data;
  },
  [types.MEDICAL_TYPE_LIST](state, data) {
    state.medicalTypeList = data;
  },
  [types.GET_SURE_STATUS](state, data) {
    state.sureStatus = data;
  },
  [types.MEDICAL_CENTER_LIST](state, data) {
    state.medicalCenterList = data;
  },
  [types.BIND_CARD_WHITE_LIST](state, data) {
    state.bindCardWhiteList = data;
  },
  [types.BIND_CARD_WHITE_LIST](state, data) {
    state.bindCardWhiteList = data;
  },
  [types.CERTIFICATES_LIST](state, data) {
    state.certificatesList = data;
  },
  [types.GET_OTHER_CHANNEL_LIST](state, data) {
    state.otherChannelList = data;
  },
  // 保存收款账号
  [types.ACCOUNT_NO](state, data) {
    state.accountNo = data;
  },
  [types.DOCTOR_LIST](state, data) {
    state.doctorList = data;
  },
  [types.DEPARTMENT_LIST](state, data) {
    state.departmentList = data;
  },
  [types.EXPORT_LIST](state, data) {
    state.exportList = data;
  },
  [types.PARTNER_LIST](state, data) {
    state.partnerList = data;
  },
  [types.FUND_STATISTICS](state, data) {
    state.fundStatistics = data;
  },
  [types.CHANNEL_CONFIG_LIST](state, data) {
    state.channelConfigList = data;
  },
  [types.GET_HA_CHANNEL](state, data) {
    state.HAChannel = data;
  },
  [types.GET_HA_CODE_LIST](state, data) {
    state.HACodeList = data;
  },
  [types.CHECKING_ACCOUNT_LIST](state, data) {
    state.checkingAccountList = data;
  },
  [types.GET_ALL_INSTITUTION](state, data) {
    state.allInstitution = data;
  },
};
