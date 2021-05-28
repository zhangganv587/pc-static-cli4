import divide from "@/services/divideAccount";
import merchant from "@/services/merchant";
import checkAccount from "@/services/checkAccount";
import invoice from "@/services/invoice";
import insurance from "@/services/insurance";
import healthAccount from "@/services/healthAccount";
import * as reconciliation from "@/services/reconciliation";
import types from "./types";

export default {
  getAccountList: ({ commit }, payload) => {
    divide.apiGetAccountList(payload).then((res) => {
      // 获得主账号
      if (res) {
        commit(types.GET_ACCOUNT_LIST, res);
      }
    });
  },
  getChannelList: ({ commit }, payload) => {
    divide.apiGetChannelList(payload).then((res) => {
      // 获得渠道
      if (res) {
        commit(types.GET_CHANNEL_LIST, res);
      }
    });
  },
  getBankList: ({ commit }, payload) => {
    divide.apiGetBankList(payload).then((res) => {
      // 获得银行列表
      if (res) {
        commit(types.GET_BANK_LIST, res);
      }
    });
  },
  getPayConfigList: ({ commit }, payload) => {
    divide.apiGetPayConfigList(payload).then((res) => {
      // 获得支付配置列表
      if (res) {
        commit(types.GET_PAYCONFIG_LIST, res);
      }
    });
  },
  getRoleList: ({ commit }, payload) => {
    merchant.apiGetRoleList(payload).then((res) => {
      // 获得角色列表
      if (res) {
        commit(types.GET_ROLE_LIST, res);
      }
    });
  },
  getDictionaryList: ({ commit }) => {
    merchant.apiGetDictionaryList().then((res) => {
      // 获得父字典列表
      if (res) {
        commit(types.GET_DICTIONARY_LIST, res);
      }
    });
  },
  getCompanyList: ({ commit }) => {
    merchant
      .apiGetDictionaryList({ dictionary: "one", pageSize: 999 })
      .then((res) => {
        // 获得所属公司列表
        if (res) {
          commit(types.GET_COMPANY_LIST, res);
        }
      });
  },
  getFinanceList: ({ commit }) => {
    merchant
      .apiGetDictionaryList({ dictionary: "two", pageSize: 999 })
      .then((res) => {
        // 获得财务审核人员列表
        if (res) {
          commit(types.GET_FINANCE_LIST, res);
        }
      });
  },
  getBizInvoiceList: ({ commit }) => {
    merchant
      .apiGetDictionaryQuery({ dictCode: "biz_invoice", pageSize: 999 })
      .then((res) => {
        // 获得业务类型列表
        if (res) {
          commit(types.GET_BIZ_INVOICE, res);
        }
      });
  },
  getBusinessList: ({ commit }) => {
    merchant
      .apiGetDictionaryQuery({
        dictCode: "business",
        enabled: 1,
        pageSize: 999,
      })
      .then((res) => {
        // 获得接入业务列表
        if (res) {
          commit(types.GET_BUSINESS_LIST, res);
        }
      });
  },
  getCurrencyList: ({ commit }) => {
    merchant
      .apiGetDictionaryQuery({
        dictCode: "currency",
        enabled: 1,
        pageSize: 999,
      })
      .then((res) => {
        // 获得币种列表
        if (res) {
          commit(types.GET_CURRENCY_LIST, res);
        }
      });
  },
  getBusinessAdministration: ({ commit }) => {
    merchant.apiGetBusinessAdministration({ pageSize: 999 }).then((res) => {
      // 获得管理业务列表
      if (res) {
        commit(types.GET_BUSINESS_ADMINISTRATION_LIST, res);
      }
    });
  },
  getPaymentAccountList: ({ commit }) => {
    merchant.apiGetPaymentAccountList({ pageSize: 999 }).then((res) => {
      // 获得支付账号列表
      if (res) {
        commit(types.GET_PAYMENT_ACCOUNT_LIST, res);
      }
    });
  },
  getMerchantAllChannelList: ({ commit }) => {
    merchant.apiGetChannelList({ pageSize: 999 }).then((res) => {
      // 获得全部的渠道列表
      if (res) {
        commit(types.GET_MERCHANT_ALL_CHANNEL, res);
      }
    });
  },
  getMerchantChannelList: ({ commit }) => {
    merchant.apiGetChannelList({ status: 0, pageSize: 999 }).then((res) => {
      // 获得启用的渠道列表
      if (res) {
        commit(types.GET_MERCHANT_CHANNEL_LIST, res);
      }
    });
  },
  getOtherChannelList: ({ commit }) => {
    merchant
      .apiGetOtherChannelList({ status: 0, pageSize: 999 })
      .then((res) => {
        // 获得其他启用的渠道列表
        if (res) {
          commit(types.GET_OTHER_CHANNEL_LIST, res);
        }
      });
  },
  getMerchantList: ({ commit }) => {
    merchant
      .apiGetDictionaryQuery({ dictCode: "company", enabled: 1, pageSize: 999 })
      .then((res) => {
        // 获得业务签约公司列表
        if (res) {
          commit(types.GET_MERCHANT_LIST, res);
        }
      });
  },
  getBusinessLine: ({ commit }) => {
    merchant
      .apiGetDictionaryQuery({
        dictCode: "biz_line",
        enabled: 1,
        pageSize: 999,
      })
      .then((res) => {
        // 获得业务签约公司列表
        if (res) {
          commit(types.GET_BUSINESS_LINE, res);
        }
      });
  },
  getBusinessNumber: ({ commit }) => {
    merchant.apiGetBusinessNumber().then((res) => {
      // 获得权限列表
      if (res) {
        commit(types.GET_BUSINESS_NUMBER, res);
      }
    });
  },
  setUserRoles: ({ commit, state }) => {
    const { userRoles } = state;
    if (!userRoles || (Array.isArray(userRoles) && userRoles.length <= 0)) {
      // 获得权限列表
      merchant.apiGetPermissionsList().then((res) => {
        if (res) {
          commit(types.USER_ROLES, res);
        }
      });
    }
  },
  getTimeNumber: ({ commit }) => {
    merchant.apiGetTimeNumber().then((res) => {
      // 生成编号
      if (res) {
        commit(types.GET_TIME_NUMBER, res);
      }
    });
  },
  getPayWayList: ({ commit }) => {
    merchant
      .apiGetDictionaryQuery({ dictCode: "pay_way", enabled: 1, pageSize: 999 })
      .then((res) => {
        // 获得支付方式
        if (res) {
          commit(types.GET_PAYWAY_LIST, res);
        }
      });
  },
  getOrderStatus: ({ commit }) => {
    merchant
      .apiGetDictionaryQuery({
        dictCode: "order_status",
        enabled: 1,
        pageSize: 999,
      })
      .then((res) => {
        // 获得订单状态
        if (res) {
          commit(types.GET_ORDER_STATUS, res);
        }
      });
  },
  getRefundStatus: ({ commit }) => {
    merchant
      .apiGetDictionaryQuery({
        dictCode: "refund_status",
        enabled: 1,
        pageSize: 999,
      })
      .then((res) => {
        // 获得退款状态
        if (res) {
          commit(types.GET_REFUND_STATUS, res);
        }
      });
  },
  getCallBackStatus: ({ commit }) => {
    merchant
      .apiGetDictionaryQuery({
        dictCode: "callback_status",
        enabled: 1,
        pageSize: 999,
      })
      .then((res) => {
        // 获得通知状态
        if (res) {
          commit(types.GET_CALLBACK_STATUS, res);
        }
      });
  },

  getBizCategory: ({ commit }) => {
    checkAccount.apiGetBizCategory().then((res) => {
      // 获取业务类型列表
      if (res) {
        commit(types.GET_BIZ_CATEGORY, res);
      }
    });
  },

  // 发票系统
  getEnterpriseList: ({ commit }) => {
    invoice.apiGetEnterpriseList().then((res) => {
      // 获取发票主体
      if (res) {
        commit(types.GET_ENTERPRISE_LIST, res);
      }
    });
  },

  // 医保后台
  getHospitalDetail: ({ commit }) => {
    insurance.apiGetHospitalDetail().then((res) => {
      // 医疗机构查询
      if (res) {
        commit(types.GET_HOSPITAL_DETAIL, res);
      }
    });
  },
  getMedicalTypeList: ({ commit }) => {
    insurance.apiGetMedicalTypeList().then((res) => {
      // 参保类型列表
      if (res) {
        commit(types.MEDICAL_TYPE_LIST, res);
      }
    });
  },
  getBindCardWhiteList: ({ commit }) => {
    insurance.apiGetBindCardWhiteList().then((res) => {
      // 绑卡白名单列表
      if (res) {
        commit(types.BIND_CARD_WHITE_LIST, res);
      }
    });
  },
  getCertificatesList: ({ commit }) => {
    insurance.apiGetCertificatesList().then((res) => {
      // 电子凭证列表
      if (res) {
        commit(types.CERTIFICATES_LIST, res);
      }
    });
  },
  getSureStatus: ({ commit }) => {
    insurance.apiGetSureStatus().then((res) => {
      // 医保结算装态列表
      if (res) {
        commit(types.GET_SURE_STATUS, res);
      }
    });
  },
  getMedicalCenterList: ({ commit }) => {
    insurance.apiGetMedicalCenterList().then((res) => {
      // 医保中心列表
      if (res) {
        commit(types.MEDICAL_CENTER_LIST, res);
      }
    });
  },
  getDoctorList: ({ commit }) => {
    insurance.apiGetDoctorList().then((res) => {
      // 医生列表
      if (res) {
        commit(types.DOCTOR_LIST, res);
      }
    });
  },
  getDepartmentList: ({ commit }) => {
    insurance.apiGeDepartmentList().then((res) => {
      // 科室列表
      if (res) {
        commit(types.DEPARTMENT_LIST, res);
      }
    });
  },
  getExportList: ({ commit }, payload) => {
    checkAccount.apiGetExportList(payload).then((res) => {
      if (res) {
        commit(types.EXPORT_LIST, res);
      }
    });
  },
  getPartnerList: ({ commit }, payload) => {
    checkAccount.apiGetPartnerList(payload).then((res) => {
      if (res) {
        commit(types.PARTNER_LIST, res);
      }
    });
  },
  getFundStatistics: ({ commit }, payload) => {
    checkAccount.apiGetStatistics(payload).then((res) => {
      if (res) {
        commit(types.FUND_STATISTICS, res);
      }
    });
  },
  postExportDelay: (payload) => {
    return checkAccount.apiPostExportDelay(payload);
  },
  getChannelConfigList: ({ commit }, payload) => {
    checkAccount.apiGetChannelConfigList(payload).then((res) => {
      if (res) {
        commit(types.CHANNEL_CONFIG_LIST, res);
      }
    });
  },
  postChannelConfigUpdate: (payload) => {
    return checkAccount.apiPostChannelConfigUpdate(payload);
  },

  // 健康账户后台
  getHAChannel: ({ commit }) => {
    healthAccount.apiGetHAChannel().then((res) => {
      // 查询用户路由
      if (res) {
        commit(types.GET_HA_CHANNEL, res);
      }
    });
  },
  getHACodeList: ({ commit }) => {
    healthAccount.apiGetHACodeList().then((res) => {
      // 查询账户类型
      if (res) {
        commit(types.GET_HA_CODE_LIST, res);
      }
    });
  },
  getCheckingAccountList: async ({ commit }) => {
    return reconciliation.fetchAccountList().then((res) => {
      if (res) {
        res.map((v) => {
          v.label = v.channelAccountNo + " | " + v.channelAccountName;
          v.value = v.channelAccountNo;
          return v;
        });
        commit(types.CHECKING_ACCOUNT_LIST, res);
      }
    });
  },
  getAllInstitution: ({ commit }) => {
    reconciliation.fetchAllInstitution().then((res) => {
      // 查询账户类型
      if (res) {
        commit(types.GET_ALL_INSTITUTION, res);
      }
    });
  },
};
