<!--
 * @Author: 张淦
 * @Date: 2019-12-07 10:39:23
 * @LastEditors: 张淦
 * @Description: 商户2.0 业务详情头部
 * @FilePath: /gpay-ops-static/src/pages/merchan/businessManage/component/business-header.vue
 -->
<template>
  <div class="details-header">
    <div class="header-ins">
      <div class="header-icon">
        <img src="../../../../assets/images/hospital.png" />
      </div>
      <div class="ins-content">
        <h3>
          {{ institution.institutionName ? institution.institutionName : "无" }}
        </h3>
        <div class="ins-detail">
          <div class="ins-center">
            机构编号：{{
              institution.institutionCode ? institution.institutionCode : "无"
            }}
          </div>
          <div class="ins-center">
            机构联系人：{{ institution.person ? institution.person : "无" }}
          </div>
          <div class="ins-center">
            机构联系人手机号：{{ institution.phone ? institution.phone : "无" }}
          </div>
        </div>
        <div class="ins-footer">
          <span
            >机构介绍：{{ institution.memo ? institution.memo : "无" }}</span
          >
          <el-tooltip
            v-show="institution.content"
            class="item"
            effect="light"
            placement="bottom-end"
          >
            <div slot="content" class="text-content" style="border: none">
              {{ institution.content }}
            </div>
            <el-button type="text" class="text-more"> 更多 </el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
    <div class="header-bus">
      <div class="bus-detail">
        <div class="bus-header">
          接入业务：{{ business.businessName ? business.businessName : "无" }}
        </div>
        <div class="bus-header">
          业务编号：{{ business.businessCode ? business.businessCode : "无" }}
        </div>
        <div class="bus-header-last">
          业务签约公司：{{ business.companyName ? business.companyName : "无" }}
        </div>
        <div class="bus-header">
          业务线：{{
            business.businessLineName ? business.businessLineName : "无"
          }}
        </div>
        <div class="bus-header">
          业务联系人：{{ business.person ? business.person : "无" }}
        </div>
        <div class="bus-header-last">
          业务联系人手机号：{{ business.phone ? business.phone : "无" }}
        </div>
      </div>
      <div class="bus-footer">
        <span
          >业务介绍：{{
            business.businessMemo ? business.businessMemo : "无"
          }}</span
        >
        <el-tooltip
          v-show="business.details"
          class="item"
          effect="light"
          placement="bottom-end"
        >
          <div slot="content" class="text-content">
            业务介绍：{{ business.details }}
          </div>
          <el-button type="text" class="text-more"> 更多 </el-button>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>
<script type="text/jsx">
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      activeName: 'config',
      institution: {
        institutionName: '',
        institutionCode: '',
        memo: '',
        person: '',
        phone: '',
        content: '',
      },
      business: {
        businessName: '',
        businessCode: '',
        companyName: '',
        companyCode: '',
        businessLineCode: '',
        businessLineName: '',
        person: '',
        phone: '',
        businessMemo: '',
        details: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      merchantList: 'merchantList',
    }),
  },
  created() {
    this.$common.judgeState({
      merchantList: 'getMerchantList',
    });
    this.getFormData(JSON.parse(localStorage.businessList));
  },
  methods: {
    getFormData(item) {
      this.$fetch('/pay/apply/institution.json', {
        method: 'post',
        data: {
          institutionCode: item.institutionCode
        },
      }).then(res => {
        if (res.code === 0) {
          if (res.data[0].memo.length > 25) {
            this.institution = res.data[0];
            this.institution.content = res.data[0].memo;
            this.institution.memo = res.data[0].memo.substring(0, 25) + '...';
          } else {
            this.institution = res.data[0];
          }
        }
      }).catch(() => {});
      if (item.businessMemo && item.businessMemo.length > 25) {
        this.business = item;
        this.business.details = item.businessMemo;
        this.business.businessMemo = item.businessMemo.substring(0, 25) + '...';
      } else {
        this.business = item;
      }

      console.log(item);
    }
  }
};
</script>
<style lang="less" scoped>
.text-more {
  padding: 0;
  font-size: 14px;
  line-height: 20px;
}
.details-header {
  display: -webkit-flex; /* Safari */
  display: flex;
  min-width: 1200px;
  padding: 16px;
  overflow: hidden;
  vertical-align: top;
  background-color: #fff;
  .header-ins {
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-wrap: wrap;
    width: 50%;
    .header-icon {
      margin-right: 16px;
      img {
        display: block;
        width: 72px;
        height: 72px;
      }
    }
    .ins-center {
      font-size: 14px;
      line-height: 20px;
      color: #59657a;
    }
  }
  .header-bus {
    width: 50%;
    margin-top: 32px;
    background: url(../../../../assets/images/straightline.png) no-repeat;
    background-position: left center;
  }
}

@media screen and (min-width: 1700px) {
  .ins-content {
    width: 630px;
    h3 {
      margin-bottom: 8px;
      font-size: 18px;
      line-height: 24px;
      color: #34384b;
    }
    .ins-detail {
      display: -webkit-flex; /* Safari */
      display: flex;
      justify-content: space-between;
      margin-bottom: 4px;
      .ins-center:last-child {
        margin: 0;
      }
    }
    .ins-footer {
      font-size: 14px;
      line-height: 20px;
      color: #59657a;
    }
  }
  .bus-detail {
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-wrap: wrap;
    width: 680px;
    padding-left: 40px;
    .bus-header {
      width: 180px;
      margin-bottom: 4px;
      font-size: 14px;
      line-height: 20px;
      color: #59657a;
    }
    .bus-header-last {
      margin: 0;
      margin-bottom: 4px;
    }
  }
  .bus-footer {
    width: 630px;
    padding-left: 40px;
    font-size: 14px;
    line-height: 20px;
    color: #59657a;
  }
}

@media screen and (max-width: 1700px) {
  .ins-content {
    width: 470px;
    h3 {
      margin-bottom: 8px;
      font-size: 18px;
      line-height: 24px;
      color: #34384b;
    }
    .ins-detail {
      display: block;
      .ins-center {
        margin-bottom: 4px;
      }
      .ins-center:last-child {
        margin: 0;
        margin-bottom: 4px;
      }
    }
    .ins-footer {
      font-size: 14px;
      line-height: 20px;
      color: #59657a;
    }
  }
  .bus-detail {
    display: -webkit-flex; /* Safari */
    display: flex;
    flex-wrap: wrap;
    width: 500px;
    padding-left: 40px;
    .bus-header {
      width: 180px;
      margin-bottom: 4px;
      font-size: 14px;
      line-height: 20px;
      color: #59657a;
    }
    .bus-header-last {
      width: 500px;
      margin: 0;
      margin-bottom: 4px;
    }
  }
  .bus-footer {
    width: 500px;
    padding-left: 40px;
  }
}
</style>
