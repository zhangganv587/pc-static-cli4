<template>
  <div class="side-nav">
    <el-menu
      class="side-nav--menu_vertical"
      text-color="#707E9E"
      active-text-color="#fff"
      background-color="#1B305C"
      :default-active="defaultActive"
      :default-openeds="defaultOpeneds"
      :collapse="isCollapse"
      :unique-opened="true"
      :router="true"
    >
      <template v-for="item in sideNav">
        <el-menu-item
          v-if="item.path === '/home' || item.path === '/enterApply'"
          :key="item.path"
          :index="item.path"
          :style="{ paddingLeft: '24px' }"
        >
          <router-link :to="item.path">
            <i class="icon iconfont side-nav--menu_icon" v-html="item.icon" />
            <span class="text">{{ item.name }}</span>
          </router-link>
        </el-menu-item>
        <el-submenu
          v-else-if="item.children.length"
          :key="item.path"
          :index="item.path"
          :class="`${displayArrow(item.children)}`"
          class="el-menu"
        >
          <template slot="title">
            <i class="icon iconfont side-nav--menu_icon" v-html="item.icon" />
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item-group v-if="item.children" class="side-nav--menu_group">
            <el-menu-item
              v-for="(subitem, key) in item.children"
              :key="key"
              :index="`${subitem.path}`"
            >
              <router-link :to="subitem.path">
                <div class="text">
                  {{ subitem.name }}
                </div>
              </router-link>
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "SideNav",
  props: {
    sideNav: {
      type: Array,
      default() {
        return [];
      },
    },
    isCollapse: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      defaultActive: "",
      defaultOpeneds: [],
    };
  },
  watch: {
    "$route.path": {
      immediate: true,
      handler(newVal) {
        this.setNavMenuStatus(newVal);
      },
    },
  },
  methods: {
    // 显示隐藏 menu 右侧箭头
    displayArrow(children) {
      return Array.isArray(children) && children.length
        ? ""
        : "side-nav--menu_arrow_hidden";
    },

    // 设置 navMenu 展开，选中状态
    setNavMenuStatus(path) {
      if (path === "/home") {
        this.defaultOpeneds = [];
        this.defaultActive = "/home";
      } else {
        const pathArr = typeof path === "string" ? path.split("/") : [];
        this.defaultOpeneds = [pathArr.slice(0, 2).join("/")];
        this.defaultActive = pathArr.slice(0, 3).join("/");
      }
    },
  },
};
</script>
<style scope lang="less">
@import url("~@/assets/less/funcs.less");

@side-nav: side-nav;

.@{side-nav} {
  overflow-x: hidden;
  overflow-y: auto;
  user-select: none;
  .calc-height(100vh, 56px);

  &--menu_vertical.el-menu--collapse {
    width: 52px;
  }

  /deep/.el-menu {
    overflow: hidden;
    border-right: none;
  }

  &--menu_arrow_hidden {
    /deep/ .el-submenu__icon-arrow {
      display: none;
    }
  }

  &--menu_group {
    // background-color: #182B53;
    /deep/ .el-menu-item-group__title {
      display: none;
    }
  }

  &--menu_icon {
    margin-right: 6px;
  }

  /deep/ .el-submenu__title {
    height: 48px;
    line-height: 48px;
  }

  .sub-menu-link {
    display: inline-block;
    width: 100%;
    color: rgb(112, 126, 158);
  }
}
</style>
