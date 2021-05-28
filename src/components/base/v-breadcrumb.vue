<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <template v-for="breadcrumb in breadcrumbList">
        <el-breadcrumb-item
          v-if="breadcrumb.path"
          :key="breadcrumb.path"
          :to="{ path: breadcrumb.path }"
        >
          {{ breadcrumb.title }}
        </el-breadcrumb-item>
        <el-breadcrumb-item v-else :key="breadcrumb.path">
          {{ breadcrumb.title }}
        </el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script>
import getAllRoutesData, { allRoutesData } from "@/menuConfig/routeData";
import { pathToRegexp } from "path-to-regexp";

export default {
  name: "VBreadcrumb",
  data() {
    this.cacheRoutePath = "";
    return {
      breadcrumbList: [],
    };
  },
  watch: {
    "$route.path": {
      immediate: true,
      handler(newVal) {
        // 避免多次相同的路径多次处理
        if (newVal !== this.cacheRoutePath) {
          this.cacheRoutePath = newVal;
          this.setBreadcrumb(newVal);
        }
      },
    },
  },
  created() {
    if (!Object.keys(allRoutesData).length) {
      getAllRoutesData();
    }
  },
  methods: {
    // 设置面包屑路径
    setBreadcrumb(path) {
      this.breadcrumbList = [];
      const currentPaths = [];
      const pathArr = path.split("/");

      pathArr.forEach((item) => {
        currentPaths.push(item);

        const currentPath = currentPaths.join("/");
        if (currentPath === "/home") {
          this.breadcrumbList.push({
            title: "首页",
          });
        } else if (currentPath === "/enterApply") {
          this.breadcrumbList.push({
            title: "机构入驻",
          });
        } else {
          let matchRoute = allRoutesData[currentPath];

          if (!matchRoute) {
            for (const key in Object.keys(allRoutesData)) {
              if (pathToRegexp(key).test(currentPath)) {
                matchRoute = allRoutesData[key];
              }
            }
          }

          if (matchRoute) {
            const matchRouteTitle =
              matchRoute.name || (matchRoute.meta && matchRoute.meta.title);

            if (process.env.NODE_ENV === "development" && !matchRouteTitle) {
              throw new Error(
                `Menus or Routes '${matchRoute.path}' don't config 'name（title）' property！`
              );
            }

            this.breadcrumbList.push({
              title: matchRouteTitle,
            });

            if (matchRoute.children) {
              matchRoute.children.forEach((item) => {
                if (item.authority === path) {
                  this.breadcrumbList.push({
                    title: item.name,
                  });
                }
              });
            }
          }
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import url("~@/assets/css/variables.less");

@breadcrumb: breadcrumb;

.@{breadcrumb} {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 16px;
  background-color: #eaecf0;

  @{deep} .el-breadcrumb__item:last-child {
    .el-breadcrumb__inner {
      color: #34384b;
    }
  }

  @{deep} .el-breadcrumb__inner {
    font-weight: 400;
    color: #8c9ab4;
    a,
    &.is-link {
      font-weight: 400;
      color: #8c9ab4;
      &:hover {
        color: #3e7fee;
      }
    }
  }

  @{deep} .el-breadcrumb__separator {
    margin: 0 8px;
    font-weight: 400;
  }
}
</style>
