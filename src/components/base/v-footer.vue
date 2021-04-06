<!--
 * @Author: 张淦
 * @Date: 2020-02-25 11:09:51
 * @LastEditors: zhanggan
 * @Description: 收银台PC端
 * @FilePath: /gpay-pc-static/src/components/base/v-footer.vue
 -->
<template>
  <div class="footer">
    <div class="footer-box">
      <div class="footer-top clearfix">
        <a target="_blank" class="logo" href="https://www.guahao.com" />
        <div class="about">
          <div class="aount-title">关于微医</div>
          <div class="about-lint-list">
            <a
              target="_blank"
              class="about-lint"
              href="https://www.guahao.com/about"
              >关于我们</a
            >
            <a
              target="_blank"
              class="about-lint"
              href="https://www.guahao.com/friendlylink/index"
              >友情链接</a
            >
            <a
              target="_blank"
              class="about-lint"
              href="https://www.guahao.com/recruitment/list"
              >加入微医</a
            >
            <a
              target="_blank"
              class="about-lint"
              href="https://www.guahao.com/statement"
              >版权声明</a
            >
            <a
              target="_blank"
              class="about-lint"
              href="https://www.guahao.com/contact"
              >联系我们</a
            >
            <a
              target="_blank"
              class="about-lint"
              href="http://e.weibo.com/95169guahaowang"
              >新浪微博</a
            >
            <a
              target="_blank"
              class="about-lint"
              href="https://www.guahao.com/nav"
              >网站地图</a
            >
            <a
              target="_blank"
              class="about-lint"
              href="https://www.guahao.com/kb"
              >知识库</a
            >
          </div>
        </div>
        <div class="help">
          <div class="help-hospital">
            <a
              target="_blank"
              href="https://www.guahao.com/hospital/partnerinfo"
              >医院合作</a
            >
          </div>
          <div class="help-service">
            <a target="_blank" href="https://www.guahao.com/help/common"
              >客服中心</a
            >
          </div>
        </div>
        <div class="company">
          <div class="company-list xiehui">
            <a target="_blank" href="http://www.cha.org.cn/">
              中国医院协会
              <br />门急诊管理专业委员会
            </a>
          </div>
          <div class="company-list fudan">
            <a target="_blank" href="http://www.fudanmed.com/manage/index.aspx"
              >上海复旦医院管理公司</a
            >
          </div>
          <div class="company-list baozhi">
            <a target="_blank" href="http://www.cfnews.org.cn">
              中国家庭报
              <br />卫计委人口文化发展中心
            </a>
          </div>
        </div>
      </div>
      <div class="footer-copyright">
        <div class="copyright-company">
          <div class="company-title">版权所有：杭州广发科技有限公司</div>
          <a
            target="_blank"
            class="hangye"
            href="https://xinyong.yunaq.com/certificate/?domain=www.guahao.com"
          />
          <a
            target="_blank"
            class="shiming"
            href="http://si.trustutn.org/info?sn=553170628029381014121&certType=1"
          />
          <a
            target="_blank"
            class="jingying"
            href="https://www.guahao.com/jyxwzba"
          />
        </div>
        <div class="copyright-list">
          <a
            target="_blank"
            class="copyright-lint"
            href="https://www.guahao.com/icpcard"
            >ICP证</a
          >
          <a
            target="_blank"
            class="copyright-lint"
            href="https://www.guahao.com/delylqx"
            >第二类医疗器械经营备案凭证</a
          >
          <a
            target="_blank"
            class="copyright-lint"
            href="https://www.guahao.com/spjyxk"
            >食品经营许可证</a
          >
          <a
            target="_blank"
            class="copyright-lint"
            href="https://www.guahao.com/ylqxwlxs"
            >医疗器械网络销售备案信息</a
          >
          <a
            target="_blank"
            class="copyright-lint"
            href="https://www.guahao.com/zzdxyw"
            >中国增值电信业务经营许可证</a
          >
          <a
            target="_blank"
            class="copyright-lint"
            href="https://www.guahao.com/medicaldrugszj"
            >互联网药品信息服务资格证</a
          >
          <a
            target="_blank"
            class="copyright-lint"
            href="https://www.guahao.com/wlxxfwxxcns"
            >网络信息服务信用承诺书</a
          >
        </div>
        <div class="copyright-num">
          <a
            target="_blank"
            href="http://beian.miit.gov.cn/publish/query/indexFirst.action"
            rel="nofollow"
            style="
              display: inline-block;
              text-decoration: none;
              height: 20px;
              line-height: 20px;
              color: #939393;
            "
            >&nbsp;浙ICP备12034511号-2</a
          >&nbsp;
          <a
            target="_blank"
            href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010902000463"
            rel="nofollow"
            style="
              display: inline-block;
              text-decoration: none;
              height: 20px;
              line-height: 20px;
              color: #939393;
            "
          >
            <img
              src="https://static.guahao.cn/img/ghs.png"
              style="float: left"
            />&nbsp;浙公网安备 33010902000463号
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Exceptiom",
};
</script>
<style lang="less" scoped>
.footer {
  width: 100%;
  border-top: 1px solid #e4e4e4;
  box-sizing: border-box;
  .footer-box {
    width: 980px;
    height: 100px;
    margin: 40px auto 0;
  }
  .footer-top {
    padding-bottom: 30px;
    border-bottom: 1px solid #e4e4e4;
  }
  .logo {
    display: block;
    float: left;
    width: 78px;
    height: 115px;
    margin: 2px 25px 6px;
    background: url(../../../src/assets/images/weDoctor.png) no-repeat;
  }
  .about {
    float: left;
    width: 219px;
    padding: 15px 0 0 36px;
    border-left: 1px solid #eee;
    .aount-title {
      margin-bottom: 5px;
      font-size: 16px;
      line-height: 18px;
    }
    .about-lint {
      display: inline-block;
      width: 88px;
      font-size: 12px;
      color: #888;
    }
  }
  .help {
    float: left;
    width: 170px;
    height: 110px;
    padding: 15px 0 0 36px;
    font-size: 16px;
    border-left: 1px solid #eee;
    .help-hospital {
      display: block;
      padding-left: 34px;
      margin-bottom: 30px;
      background: url(../../../src/assets/images/spritesheet.png) no-repeat;
      background-position: -5px -100px;
      a {
        display: block;
        width: 117px;
        color: #333;
        background: #fff;
      }
    }
    .help-service {
      display: block;
      padding-left: 34px;
      margin-bottom: 6px;
      background: url(../../../src/assets/images/spritesheet.png) no-repeat;
      background-position: -123px -5px;
      a {
        display: block;
        width: 117px;
        height: 31px;
        line-height: 31px;
        color: #333;
        background: #fff;
      }
    }
  }
  .company {
    position: relative;
    float: left;
    width: 460px;
    height: 110px;
    padding-left: 36px;
    border-left: 1px solid #eee;
    .company-list {
      display: inline-block;
      width: 50px;
      height: 48px;
      a {
        display: block;
        width: 208px;
        padding-left: 64px;
        font-size: 12px;
        line-height: 16px;
        color: #888;
      }
    }
    .xiehui {
      position: absolute;
      top: 7px;
      left: 36px;
      background: url(../../../src/assets/images/spritesheet.png) no-repeat;
      background-position: -63px -5px;
    }
    .fudan {
      position: absolute;
      top: 7px;
      left: 260px;
      background: url(../../../src/assets/images/spritesheet.png) no-repeat;
      background-position: -109px -53px;
      a {
        padding-left: 50px;
      }
    }
    .baozhi {
      position: absolute;
      top: 61px;
      left: 36px;
      background: url(../../../src/assets/images/spritesheet.png) no-repeat;
      background-position: -5px -5px;
    }
  }
  .footer-copyright {
    width: 980px;
    padding: 20px 0;
    margin: 0 auto;
    font-size: 12px;
    color: #888;
    text-align: center;
    .copyright-company {
      display: -webkit-flex; /* Safari */
      display: flex;
      justify-content: center;
      align-items: center;
      height: 36px;
      font-size: 12px;
      line-height: 36px;
      .company-title {
        display: block;
        margin-right: 4px;
      }
      a {
        display: block;
        width: 77px;
        height: 31px;
        margin-right: 4px;
      }
      .hangye {
        background: url(../../../src/assets/images/homepage-sp.png?_=20170508) -169px -31px
          no-repeat;
      }
      .shiming {
        background: url(../../../src/assets/images/homepage-sp.png?_=20170508) -167px
          0 no-repeat;
      }
      .jingying {
        background: url(../../../src/assets/images/homepage-sp.png?_=20170508) -168px -58px
          no-repeat;
      }
    }
    .copyright-list {
      height: 20px;
      a {
        margin-left: 10px;
        font-size: 12px;
        line-height: 20px;
        color: #939393;
      }
    }
  }
}
</style>
