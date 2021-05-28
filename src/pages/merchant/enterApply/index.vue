<!--
 * @Author: 张淦
 * @Date: 2019-11-28 11:12:48
 * @LastEditors: 张淦
 * @Description: 商户2.0 机构信息页
 * @FilePath: /gpay-ops-static/src/pages/enterApply/index.vue
 -->
<template>
  <div class="enter">
    <div class="enter-title">机构信息</div>
    <el-card v-show="auditStyle === 1 || auditStyle === 2" class="box-card">
      <div slot="header" class="clearfix">
        <span>审核结果</span>
      </div>
      <el-form
        ref="aduit"
        label-width="140px"
        label-position="right"
        :model="aduitForm"
      >
        <el-form-item label="审核结果：">
          <span v-show="auditStyle === 1">待审核</span>
          <span v-show="auditStyle === 2">审核驳回</span>
        </el-form-item>
        <el-form-item v-show="auditStyle === 2" label="驳回原因：">
          {{ aduitForm.memo ? aduitForm.memo : "" }}
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>机构信息</span>
      </div>
      <el-form
        ref="institution"
        label-width="140px"
        label-position="right"
        :model="institutionForm"
        :rules="rules"
      >
        <div v-show="!insAbeld">
          <el-form-item label="机构名称：" prop="institutionName">
            <el-autocomplete
              v-model="institutionForm.institutionName"
              popper-class="my-autocomplete"
              :fetch-suggestions="querySearch"
              placeholder="请输入医院或药店名称"
              @select="handleSelect"
            >
              <template slot-scope="{ item }">
                {{ item.institutionName }}
              </template>
            </el-autocomplete>
          </el-form-item>
          <el-form-item label="机构简介：" prop="memo">
            <el-input
              v-model="institutionForm.memo"
              type="textarea"
              :rows="3"
              :maxlength="200"
              placeholder="请输入机构简介"
              clearable
            />
          </el-form-item>
          <el-form-item label="机构联系人：" required prop="person">
            <el-input
              v-model="institutionForm.person"
              placeholder="请输入机构联系人姓名"
              :maxlength="15"
              clearable
            />
          </el-form-item>
          <el-form-item label="联系人手机号：" required prop="phone">
            <el-input
              v-model="institutionForm.phone"
              placeholder="请输入联系人手机号"
              clearable
            />
          </el-form-item>
        </div>
        <div v-show="insAbeld">
          <el-form-item label="机构名称：">
            {{ institutionForm.institutionName }}
            <el-button
              v-show="!(auditAdminStyle === true || auditStyle === 1)"
              type="text"
              style="margin-left: 16px"
              @click="reenter"
            >
              重新输入
            </el-button>
          </el-form-item>
          <el-form-item label="机构简介：">
            {{ institutionForm.memo }}
          </el-form-item>
          <el-form-item label="机构联系人：">
            {{ institutionForm.person }}
          </el-form-item>
          <el-form-item label="联系人手机号：">
            {{ institutionForm.phone }}
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>接入业务</span>
      </div>
      <el-form
        ref="business"
        label-width="140px"
        label-position="right"
        :model="businessForm"
        :rules="rules"
      >
        <div v-show="!busAbled">
          <el-form-item label="接入业务：" required prop="businessCode">
            <el-select
              v-model="businessForm.businessCode"
              placeholder="请选择入驻机构需接入的业务"
              clearable
              filterable
              @focus="searchBusiness"
              @change="searchBusiness"
            >
              <el-option
                v-for="(business, index) in businessList"
                :key="`business${index}`"
                :label="business.businessName"
                :value="business.businessCode"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="业务签约公司：" required prop="companyCode">
            <el-select
              v-model="businessForm.companyCode"
              placeholder="请选择微医集团与入驻机构签约的公司"
              clearable
              filterable
              style="margin-right: 10px"
            >
              <el-option
                v-for="(merchant, index) in merchantList"
                :key="`merchant${index}`"
                :label="merchant.dictText"
                :value="merchant.dictValue"
              />
            </el-select>
            <p class="form-item-extra">
              微医集团与入驻机构进行签约使用的子公司
            </p>
          </el-form-item>
          <el-form-item label="业务线：" required prop="businessLineCode">
            <el-select
              v-model="businessForm.businessLineCode"
              placeholder="请选择业务营收归属的业务线"
              clearable
              filterable
            >
              <el-option
                v-for="(business, index) in businessLine"
                :key="`business${index}`"
                :label="business.dictText"
                :value="business.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="业务介绍：" required prop="businessMemo">
            <el-input
              v-model="businessForm.businessMemo"
              placeholder="请输入业务介绍"
              type="textarea"
              :rows="3"
              :maxlength="200"
              clearable
            />
          </el-form-item>
          <el-form-item label="业务联系人：" required prop="person">
            <el-input
              v-model="businessForm.person"
              placeholder="请输入业务联系人姓名"
              :maxlength="15"
              clearable
            />
          </el-form-item>
          <el-form-item label="联系人手机号：" required prop="phone">
            <el-input
              v-model="businessForm.phone"
              placeholder="请输入联系人手机号"
              clearable
            />
            <p class="form-item-extra">
              <span class="warning">注意：</span
              >入驻结果将以短信方式通知到该手机号
            </p>
          </el-form-item>
          <el-form-item label="签约协议文件：" prop="protocolAddress">
            <el-upload
              ref="upload"
              class="upload-demo"
              :action="actionUrl"
              with-credentials
              :before-upload="beforeAvatarUpload"
              :on-success="uploadSuccess"
              :on-remove="handleRemove"
              :on-change="handleChange"
            >
              <el-button>
                <i class="vit-icon vit-icon-upload vit-icon-small">上传文件</i>
              </el-button>
            </el-upload>
            <div
              v-show="
                auditStyle === 2 && !uploadSuc && businessForm.protocolName
              "
              class="agreement"
            >
              <i class="icon iconfont">&#xe07b;</i>
              <a :href="businessForm.protocolAddress" target="_blank">{{
                businessForm.protocolName
              }}</a>
            </div>
            <p class="form-item-extra">
              请上传入驻机构与微医集团签署的合作协议<br />支持doc、docx、pdf格式的文件，文件最大5M
            </p>
          </el-form-item>
        </div>
        <div v-show="busAbled">
          <el-form-item label="接入业务：">
            {{ businessForm.businessName }}
            <p class="form-item-extra">请选择入驻机构需要接入的业务</p>
          </el-form-item>
          <el-form-item label="业务签约公司：">
            {{ businessForm.companyName }}
            <p class="form-item-extra">
              微医集团与入驻机构进行签约使用的子公司
            </p>
          </el-form-item>
          <el-form-item label="业务线：">
            {{ businessForm.businessLineName }}
            <p class="form-item-extra">业务营收归属的业务线</p>
          </el-form-item>
          <el-form-item label="业务介绍：">
            {{ businessForm.businessMemo }}
          </el-form-item>
          <el-form-item label="业务联系人：">
            {{ businessForm.person }}
          </el-form-item>
          <el-form-item label="联系人手机号：">
            {{ businessForm.phone }}
            <p class="form-item-extra">入驻结果将以短信方式通知到该手机号</p>
          </el-form-item>
          <el-form-item label="签约协议文件：">
            <div v-show="businessForm.protocolName" class="agreement">
              <i class="icon iconfont">&#xe07b;</i>
              <a :href="businessForm.protocolAddress" target="_blank">{{
                businessForm.protocolName
              }}</a>
            </div>
            <div v-show="!businessForm.protocolName" class="agreement">无</div>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <div v-show="!busAbled" class="footerSubmit">
      <el-button type="primary" style="margin: 0 auto" @click="onSubmit">
        提交审核
      </el-button>
    </div>
    <el-card v-show="auditAdminStyle" class="box-card">
      <div slot="header" class="clearfix">
        <span>审核操作</span>
      </div>
      <el-form
        ref="examine"
        label-width="150px"
        label-position="right"
        :model="examineForm"
        :rules="rules"
      >
        <el-form-item label="审核结果" prop="mode">
          <el-radio-group v-model="examineForm.mode">
            <el-radio :label="0"> 通过 </el-radio>
            <el-radio :label="1"> 驳回 </el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-show="examineForm.mode === 0">
          <el-form-item label="收款方式：" required prop="paymentMethod">
            <el-radio-group
              v-model="examineForm.paymentMethod"
              :disabled="true"
            >
              <el-radio :label="0"> 代收 </el-radio>
              <el-radio :label="1"> 直付 </el-radio>
            </el-radio-group>
            <p v-show="examineForm.paymentMethod === 0" class="form-item-extra">
              代收为资金先收入微医集团的收款账号再按固定时间结算给对应商家
            </p>
            <p v-show="examineForm.paymentMethod === 1" class="form-item-extra">
              直付为资金直接进入商家的收款账号
            </p>
          </el-form-item>
          <div v-show="examineForm.paymentMethod === 0">
            <el-form-item
              label="支付宝收款账号："
              prop="alipay"
              class="is-required"
            >
              <el-select
                v-model="examineForm.alipay"
                placeholder="请选择支付宝收款账号"
                clearable
                @focus="searchPayAccount('alipay')"
              >
                <el-option
                  v-for="(payment, index) in payAccountList"
                  :key="`payment${index}`"
                  :label="payment.accountNo"
                  :value="payment.accountNo"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="微信收款账号："
              prop="wxpay"
              class="is-required"
            >
              <el-select
                v-model="examineForm.wxpay"
                placeholder="请选择微信收款账号"
                clearable
                @focus="searchPayAccount('wxpay')"
              >
                <el-option
                  v-for="(payment, index) in payAccountList"
                  :key="`payment${index}`"
                  :label="payment.accountNo"
                  :value="payment.accountNo"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="健康账户收款账号：" prop="wybank">
              <el-select
                v-model="examineForm.wybank"
                placeholder="请选择健康账户收款账号"
                clearable
                @focus="searchPayAccount('wybank')"
              >
                <el-option
                  v-for="(payment, index) in payAccountList"
                  :key="`payment${index}`"
                  :label="payment.accountNo"
                  :value="payment.accountNo"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div v-show="examineForm.mode === 1">
          <el-form-item label="驳回原因：" prop="reason" class="is-required">
            <el-input
              v-model="examineForm.reason"
              type="textarea"
              :rows="3"
              :maxlength="200"
            />
          </el-form-item>
        </div>
        <el-form-item style="text-align: center">
          <el-button type="primary" @click="examineSubmit"> 提交 </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { UPLOAD_URL, MOBILE_REG } from "@/utils/constants";

export default {
  name: "EnterIndex",
  data() {
    this.cacheRow = {
      id: null, // 审批驳回id
      institutionForm: {
        institutionName: null,
        institutionCode: null,
        memo: null,
        person: null,
        phone: null,
      },
      businessForm: {
        businessCode: null,
        businessName: null,
        companyCode: null,
        companyName: null,
        businessLineCode: null,
        businessLineName: null,
        businessMemo: null,
        person: null,
        phone: null,
        protocolAddress: null,
        protocolName: null,
      },
    };
    var checkReason = (rule, value, callback) => {
      if (!value && this.examineForm.mode === 1) {
        callback(new Error("驳回原因不能为空"));
      } else {
        callback();
      }
    };
    var checkAlipay = (rule, value, callback) => {
      if (
        !value &&
        this.examineForm.mode === 0 &&
        this.examineForm.paymentMethod === 0
      ) {
        callback(new Error("支付宝收款账号必选"));
      } else {
        callback();
      }
    };
    var checkWxpay = (rule, value, callback) => {
      if (
        !value &&
        this.examineForm.mode === 0 &&
        this.examineForm.paymentMethod === 0
      ) {
        callback(new Error("微信收款账号必选"));
      } else {
        callback();
      }
    };
    return {
      id: null, // 审批驳回id
      actionUrl: UPLOAD_URL,
      auditStyle: 0, // 审核状态 0:商户入驻 1:待审核 2:审核驳回
      aduitForm: {
        // 审批信息
        id: null,
        memo: null,
      },
      insAbeld: false, // 机构信息
      institutionForm: {
        institutionName: null,
        institutionCode: null,
        memo: null,
        person: null,
        phone: null,
      },
      busAbled: false, // 接入业务
      businessForm: {
        businessCode: null,
        businessName: null,
        companyCode: null,
        companyName: null,
        businessLineCode: null,
        businessLineName: null,
        businessMemo: null,
        person: null,
        phone: null,
        protocolAddress: null,
        protocolName: null,
      },
      uploadSuc: false, // 上传状态
      businessList: [], // 业务列表
      restaurants: [],
      auditAdminStyle: false, // 待审批
      examineForm: {
        mode: 0,
        paymentMethod: 0,
        alipay: "",
        wxpay: "",
        wybank: "",
        reason: "",
      },
      payAccountList: [], // 支付账号列表
      rules: {
        institutionName: [
          {
            required: true,
            message: "机构名称必填",
            trigger: ["blur", "change"],
          },
          { max: 40, message: "最多40个字符", trigger: "blur" },
        ],
        memo: [
          {
            required: true,
            message: "机构简介必填",
            trigger: ["blur", "change"],
          },
        ],
        businessMemo: [
          {
            required: true,
            message: "业务介绍必填",
            trigger: ["blur", "change"],
          },
        ],
        person: [
          {
            required: true,
            message: "联系人必填",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          {
            required: true,
            message: "联系人手机号必填",
            trigger: ["blur", "change"],
          },
          { pattern: MOBILE_REG, message: "手机号格式不正确", trigger: "blur" },
        ],
        businessCode: [
          {
            required: true,
            message: "接入业务必选",
            trigger: ["blur", "change"],
          },
        ],
        companyCode: [
          {
            required: true,
            message: "业务签约公司必选",
            trigger: ["blur", "change"],
          },
        ],
        businessLineCode: [
          {
            required: true,
            message: "业务线必选",
            trigger: ["blur", "change"],
          },
        ],
        reason: [{ validator: checkReason, trigger: ["blur", "change"] }],
        alipay: [{ validator: checkAlipay, trigger: ["blur", "change"] }],
        wxpay: [{ validator: checkWxpay, trigger: ["blur", "change"] }],
      },
    };
  },
  computed: {
    ...mapGetters({
      businessLine: "businessLine",
      merchantList: "merchantList",
    }),
  },
  watch: {
    "$route.path": {
      immediate: true,
      handler(newVal) {
        const obj = JSON.parse(localStorage.businessList);

        if (newVal.indexOf("/info") > -1) {
          // 入驻开始
          this.busAbled = false;
          this.insAbeld = false;
          this.auditStyle = 0;
          this.auditAdminStyle = false;
          this.id = this.cacheRow.id;
          this.institutionForm = this.cacheRow.institutionForm;
          this.businessForm = this.cacheRow.businessForm;
          this.$nextTick(() => {
            this.$refs.institution.clearValidate();
            this.$refs.business.clearValidate();
          });
        } else {
          this.id = obj.id;
          Object.keys(this.aduitForm).forEach((key) => {
            this.aduitForm[key] = obj[key] || "";
          });
          this.businessList = [
            { businessName: obj.businessName, businessCode: obj.businessCode },
          ];
          Object.keys(this.businessForm).forEach((key) => {
            this.businessForm[key] = obj[key] || "";
          });
          if (obj.institutionCode) {
            this.getInstitutionForm(obj.institutionCode);
          }
          if (newVal.indexOf("/show") > -1) {
            // 商户查看，待审批
            this.insAbeld = true;
            this.busAbled = true;
            this.auditStyle = 1;
            this.auditAdminStyle = false;
          } else if (newVal.indexOf("/rejected") > -1) {
            // 商户查看，审批驳回
            this.insAbeld = false;
            this.busAbled = false;
            this.auditStyle = 2;
            this.auditAdminStyle = false;
            this.getBusinessList(obj.institutionCode);
          } else if (newVal.indexOf("/operate") > -1) {
            // 管理员查看，审批入驻
            this.insAbeld = true;
            this.busAbled = true;
            this.auditStyle = 0;
            this.auditAdminStyle = true;
          }
        }
      },
    },
  },
  created() {
    this.$common.judgeState({
      businessLine: "getBusinessLine",
      merchantList: "getMerchantList",
    });
    this.getRestaurants();
  },
  methods: {
    getRestaurants() {
      // 机构名称列表
      this.$fetch("/pay/apply/institution.json", {
        method: "post",
        data: {
          institutionCode: "",
        },
      }).then((res) => {
        if (res.code === 0 && res.data) {
          this.restaurants = res.data;
        }
      });
    },
    getBusinessList(institutionCode) {
      // 接入业务列表
      this.$fetch("/pay/apply/business.json", {
        method: "post",
        data: {
          institutionCode,
        },
      }).then((res) => {
        if (res.code === 0) {
          if (this.businessList.length === 1 && res.data !== null) {
            const contain = res.data.some((item) => {
              return item.businessCode === this.businessList[0].businessCode;
            });
            if (contain) {
              this.businessList = res.data;
            } else {
              this.businessForm.businessCode = "";
              this.businessList = [];
            }
          } else if (this.businessList.length === 1 && res.data === null) {
            this.businessForm.businessCode = "";
            this.businessList = [];
          } else {
            this.businessList = res.data;
          }
        }
      });
    },
    getInstitutionForm(institutionCode) {
      // 查看审核结果，获取机构数据
      this.$fetch("/pay/apply/institution.json", {
        method: "post",
        data: {
          institutionCode,
        },
      }).then((res) => {
        if (res.code === 0 && res.data.length) {
          this.institutionForm = res.data[0];
        }
      });
    },
    querySearch(queryString, cb) {
      // 查询是否存在该机构
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.institutionName
            .toLowerCase()
            .indexOf(queryString.toLowerCase()) > -1
        );
      };
    },
    handleSelect(item) {
      // 选择已有的机构
      this.insAbeld = true;
      this.institutionForm = item;
      this.businessForm.businessCode = "";
    },
    reenter() {
      // 重新输入
      this.institutionForm = this.cacheRow.institutionForm;
      this.insAbeld = false;
      this.$nextTick(() => {
        this.$refs.institution.clearValidate();
        this.$refs.business.clearValidate();
      });
    },
    searchBusiness() {
      // 接入业务选择
      this.getBusinessList(this.institutionForm.institutionCode);
    },
    searchPayAccount(payWayCode) {
      this.$fetch("/pay/account/list.json", {
        method: "post",
        data: {
          payWayCode,
          companyCode: this.businessForm.companyCode,
        },
      }).then((res) => {
        if (res.code === 0 && res.data) {
          this.payAccountList = res.data;
        }
      });
    },
    beforeAvatarUpload(file) {
      const isFile =
        file.type === "application/pdf" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isFile) {
        this.$message.error("请上传doc、docx、pdf格式的文件!");
      }
      if (!isLt2M) {
        this.$message.error("文件最大5M!");
      }
      return isFile && isLt2M;
    },
    handleRemove(file, fileList) {
      this.businessForm.protocolAddress = "";
    },
    handleChange(files, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
    },
    uploadSuccess(res) {
      this.uploadSuc = true;
      this.businessForm.protocolAddress = res.data.url;
    },
    onSubmit() {
      this.$refs.institution.validate((valid) => {
        if (valid) {
          this.$refs.business.validate((va) => {
            if (va) {
              this.businessList.forEach((item) => {
                if (item.businessCode === this.businessForm.businessCode) {
                  this.businessForm.businessName = item.businessName;
                }
              });
              this.businessLine.forEach((item) => {
                if (item.dictValue === this.businessForm.businessLineCode) {
                  this.businessForm.businessLineName = item.dictText;
                }
              });
              this.merchantList.forEach((item) => {
                if (item.dictValue === this.businessForm.companyCode) {
                  this.businessForm.companyName = item.dictText;
                }
              });
              this.$fetch("/pay/apply/apply.json", {
                method: "post",
                data: {
                  id: this.id,
                  merchantInstitutionVO: { ...this.institutionForm },
                  merchantBusinessVO: { ...this.businessForm },
                },
              }).then((res) => {
                if (res.code === 0) {
                  this.$router.push({
                    path: `/enterApply/tip/${this.businessForm.phone}`,
                  });
                }
              });
            } else {
              this.$message({
                type: "error",
                message: "接入信息填写有误请检查!",
              });
              return false;
            }
          });
        } else {
          this.$message({
            type: "error",
            message: "机构信息填写有误请检查!",
          });
          return false;
        }
      });
    },
    examineSubmit() {
      this.$refs.examine.validate((valid) => {
        if (valid) {
          const value = this.examineForm.mode;
          const url = ["/pay/business/audit.json", "/pay/business/down.json"];
          let data = [];
          if (this.examineForm.wybank !== "") {
            data = [
              {
                institutionCode: this.institutionForm.institutionCode,
                institutionName: this.institutionForm.institutionName,
                businessCode: this.businessForm.businessCode,
                paymentMethod: this.examineForm.paymentMethod,
                id: this.id,
                payWayVOS: [
                  {
                    accountNo: this.examineForm.alipay,
                    payWayCode: "alipay",
                    payWayName: "支付宝",
                    companyCode: this.businessForm.companyCode,
                    companyName: this.businessForm.companyName,
                  },
                  {
                    accountNo: this.examineForm.wxpay,
                    payWayCode: "wxpay",
                    payWayName: "微信",
                    companyCode: this.businessForm.companyCode,
                    companyName: this.businessForm.companyName,
                  },
                  {
                    accountNo: this.examineForm.wybank,
                    payWayCode: "wybank",
                    payWayName: "健康账户",
                    companyCode: this.businessForm.companyCode,
                    companyName: this.businessForm.companyName,
                  },
                ],
              },
              {
                id: this.id,
                reason: this.examineForm.reason,
              },
            ];
          } else {
            data = [
              {
                institutionCode: this.institutionForm.institutionCode,
                institutionName: this.institutionForm.institutionName,
                businessCode: this.businessForm.businessCode,
                paymentMethod: this.examineForm.paymentMethod,
                id: this.id,
                payWayVOS: [
                  {
                    accountNo: this.examineForm.alipay,
                    payWayCode: "alipay",
                    payWayName: "支付宝",
                    companyCode: this.businessForm.companyCode,
                    companyName: this.businessForm.companyName,
                  },
                  {
                    accountNo: this.examineForm.wxpay,
                    payWayCode: "wxpay",
                    payWayName: "微信",
                    companyCode: this.businessForm.companyCode,
                    companyName: this.businessForm.companyName,
                  },
                ],
              },
              {
                id: this.id,
                reason: this.examineForm.reason,
              },
            ];
          }
          this.$fetch(url[value], {
            method: "post",
            data: {
              ...data[value],
            },
          }).then((res) => {
            if (res.code === 0) {
              this.$router.push({ path: "/business/audit" });
            }
          });
        } else {
          this.$message({
            type: "error",
            message: "审核信息填写有误请检查!",
          });
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.enter-title {
  margin: 40px 0;
  font-size: 20px;
  font-weight: 500;
  color: #34384b;
  text-align: center;
}
.enter {
  .box-card {
    width: 1000px;
    margin: 0 auto 40px;
    box-shadow: none;
  }
  .agreement {
    padding: 9px 17px;
    background: rgba(248, 250, 254, 1);
    border-radius: 4px;
    i {
      color: #8c9ab4;
    }
    a {
      color: #34384b;
    }
  }
  // card
  /deep/.el-card__header {
    padding: 10px 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;
    color: #34384b;
    background: #f8fafe;
  }
  // form
  .el-form-item .el-form-item__content .el-autocomplete {
    width: 100%;
  }
  .el-form-item__content {
    margin-right: 300px;
    .warning {
      color: #f35e5e;
    }
  }
}
.footerSubmit {
  text-align: center;
}
</style>
