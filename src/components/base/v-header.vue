<!--
 * @Author: 张淦
 * @Date: 2019-11-28 11:12:48
 * @LastEditors: zhanggan
 * @Description: 商户2.0 删除帮助，增加头像
 * @FilePath: /gpay-ops-static/src/components/base/v-header.vue
 -->
<template>
  <div class="header">
    <i
      class="vit-icon vit-icon-nav-unfold vit-icon-small header--collapse_icon"
      :class="`${isCollapse ? 'collapse' : ''}`"
      @click="handleNavMenuCollapse"
    />
    <div class="header--box">
      <div v-if="name || userId" class="header--username">
        <span>{{ name }} | </span>
        <span>{{ userId }}</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Header",
  props: {
    isCollapse: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      name: "",
      userId: "",
    };
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    handleNavMenuCollapse() {
      this.$emit("on-collapse");
    },
    getUserInfo() {
      this.$fetch("/personnel/query.json").then((res) => {
        if (res.code === 0) {
          const userInfos =
            typeof res.data === "string" ? res.data.split("|") : "";

          if (userInfos.length === 2) {
            this.name = userInfos[0];
            this.userId = userInfos[1];
            localStorage.setItem("userName", this.userId);
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@header: header;

.@{header} {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 56px;
  background: #34384b;
  box-shadow: 0px 2px 8px 0px rgba(35, 40, 51, 0.2);
  &--collapse_icon {
    font-size: 14px;
    color: #c1cad9;
    cursor: pointer;
    transform: rotateZ(0deg);
    transition: transform 0.24s ease-out;
    user-select: none;
    &.collapse {
      transform: rotateZ(-180deg);
    }
  }
  &--box {
    display: flex;
    align-items: center;
    .icon {
      margin-right: 6px;
    }
  }
  &--help {
    display: flex;
    align-items: center;
    color: #fff;
    &:hover {
      color: #fff;
    }
  }
  &--username {
    margin-left: 24px;
    color: #fff;
  }
}
</style>
