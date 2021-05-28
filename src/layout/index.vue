<template>
  <div class="layout">
    <el-container>
      <el-aside :width="getLeftWidth" class="layout--left">
        <v-logo :is-collapse="isCollapse" />
        <!-- <v-sider
          :side-nav="getAuthMenuDatas"
          :is-collapse="isCollapse"
        /> -->
        <vit-menubar
          :actived="actived"
          :collapse="isCollapse"
          :router="true"
          :data-source="getAuthMenuDatas"
          style="background: #4a597d"
        />
      </el-aside>
      <el-container>
        <el-header
          height="56px"
          style="background: #34384b"
          class="layout--header"
        >
          <v-header
            :is-collapse="isCollapse"
            @on-collapse="handleChangeCollapse"
          />
        </el-header>
        <el-main ref="elMain" style="padding: 0">
          <v-breadcrumb v-if="showBreadcrumb !== false" />
          <div class="layout--container_main">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { pathToRegexp } from "path-to-regexp";
import VLogo from "@/components/base/v-logo";
import VHeader from "@/components/base/v-header";
// import SideNav from '@/components/base/we-sideNav';
import VBreadcrumb from "@/components/base/v-breadcrumb";
// import getAllRoutesData from '@/menuConfig/routeData';
import getMenuData from "@/menuConfig/menuData";
import { URL_WHITE_LIST } from "@/utils/constants";

export default {
  name: "Layout",
  components: {
    // 'v-sider': SideNav,
    "v-header": VHeader,
    "v-breadcrumb": VBreadcrumb,
    "v-logo": VLogo,
  },
  data() {
    return {
      actived: "",
      sideNav: [],
      isCollapse: false,
      showBreadcrumb: true,
    };
  },
  computed: {
    getLeftWidth() {
      return this.isCollapse ? "52px" : "195px";
    },
    getAuthMenuDatas() {
      return getMenuData(this.$store.state.userRoles);
    },
  },
  watch: {
    "$route.meta.showBreadcrumb"(newVal) {
      this.showBreadcrumb = newVal;
    },
    "$store.state.userRoles"(newVal) {
      // debugger;
      // 配合 beforeEach 路由生命周期函数做校验处理
      // const routeDatas = getAllRoutesData(newVal);
      const { path: fullPath } = this.$route;

      // if (meta && meta.needCheckAuth !== false) {
      //   const isPassPath = Object.keys(routeDatas).some(path => {
      //     // 处理 /user/:id 匹配 /user/lane
      //     let isPathMatch = pathToRegexp(path).test(fullPath);

      //     if (!isPathMatch) {
      //       // 处理 /user 匹配 /user?name=lane
      //       const queryIndex = fullPath.includes('?');

      //       if (queryIndex > -1) {
      //         isPathMatch = (path === fullPath.slice(0, queryIndex));
      //       }
      //     }

      //     return isPathMatch;
      //   });

      //   if (!isPassPath) {
      //     this.$router.replace('/notpermission');
      //   }
      // }
      if (URL_WHITE_LIST.includes(fullPath)) {
        // 白名单内的 不校验
        // next();
      } else if (newVal === "") {
        // 初始化未获得接口数据时 不校验
        // next();
      } else if (newVal !== "") {
        if (!newVal.includes(fullPath)) {
          const isPathMatch = newVal.some((path) => {
            return pathToRegexp(path).test(fullPath);
          });
          if (!isPathMatch) {
            this.$router.replace("/notpermission");
          }
        }
      } else {
        this.$router.replace("/notpermission");
        //   }
      }
    },
  },
  mounted() {
    this.actived = location.pathname.replace("/newhealth", "");
  },
  methods: {
    handleChangeCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>
<style lang="less">
@import url("~@/assets/css/funcs.less");

@layout: layout;

.@{layout} {
  background-color: #f3f5fa;
  &--left {
    z-index: 110;
    height: 100vh;
    background-color: #4a597d;
    // background: linear-gradient(180deg, #2e328b 0%, #180e50 100%);
    transition: all 0.24s ease-out;
  }

  &--header {
    z-index: 100;
    overflow: hidden;
    background-color: #fff;
    box-shadow: 0px 2px 10px 0px rgba(52, 56, 75, 0.1);
  }

  &--container_main {
    position: relative;
    padding: 16px;
    overflow: hidden;
    overflow-y: auto;
    background-color: #fff;
    .calc-height(100vh, 116px);
  }
}
</style>
