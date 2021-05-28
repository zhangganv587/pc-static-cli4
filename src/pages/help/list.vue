<template>
  <div class="help-list">
    <el-card shadow="never">
      <template slot="header">
        <el-row>
          <el-col :span="14" :push="5">
            <div class="help-search">
              <el-input
                v-model="keyword"
                class="search-input"
                placeholder="请输入关键字进行搜索"
                size="large"
                @keyup.native.enter="handleSearchKeys"
              />
              <el-button
                type="primary"
                icon="el-icon-search"
                size="large"
                @click="handleSearchKeys"
              />
            </div>
          </el-col>
        </el-row>
      </template>
      <template>
        <el-collapse v-model="activeKeys" class="help-content">
          <el-collapse-item
            v-for="help in helpData"
            :key="help.key"
            :title="help.title"
            :name="help.key"
          >
            <div
              v-for="item in help.children"
              :key="item.key"
              class="help-content-item"
            >
              <a
                :href="`https://nebula.guahao.cn/center/appDoc/68/${item.key}`"
                target="_blank"
                rel="noopener noreferrer"
                class="help-content-link"
              >
                {{ item.title }}
              </a>
            </div>
          </el-collapse-item>
        </el-collapse>
      </template>
    </el-card>
  </div>
</template>
<script>
import helpData, { searchKeys } from "./search";

export default {
  name: "HelpList",
  data() {
    this.helpData = helpData;
    return {
      keyword: "",
      activeKeys: "",
    };
  },
  methods: {
    handleSearchKeys() {
      console.log(searchKeys(this.keyword));
      this.activeKeys = searchKeys(this.keyword);
    },
  },
};
</script>
<style lang="less" scoped>
.help-list {
  padding: 10px 8px;
  /deep/ .el-card__header {
    border-bottom: none;
  }
  .help-search {
    display: flex;
  }
  .search-input {
    margin-right: 10px;
  }

  .help-content {
    .help-content-item {
      padding: 10px 0;
    }
    .help-content-link {
      color: #8c9ab4;
      &:hover {
        color: #3e7fee;
      }
    }
    /deep/ .el-collapse-item__content {
      padding-left: 1em;
    }
  }
}
</style>
