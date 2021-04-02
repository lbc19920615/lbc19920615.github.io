Vue.component('TocTree', {
  props: ['text'],
  template: `
    <div class="toc-tree" v-if="show">
      <v-style>
        @media screen and (min-width: 1024px) {
          .toc-tree {
            position: fixed;
            right: calc((100vw - 1180px) / 2);
            transform: translateX(100%);
            z-index: 1000111;
            top: calc(var(--header-height) + 20px);
          }
        }

        .toc-tree .el-tree {
          background: rgba(255,255,255,.6);
          font-size: 14px;
          box-shadow: 0 0 10px #eee;
          padding: 10px;
        }

        .toc-tree .el-tree-node__content {
          flex-wrap: wrap;
          height: initial;
          height: auto;
        }

        .toc-tree .custom-tree-node {
          max-width: 15em;
          white-space: normal;
        }
      </v-style>
      <el-tree :data="data" :props="defaultProps"
      default-expand-all
      @node-click="handleNodeClick">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <template v-if="data.level < 2">导航</template>
        <template v-else>{{data.text}}</template>
      </span>
      </el-tree>
    </div>
  `,
  data() {
    return {
      show: false,
      data: window.curPageInfo.toc,
      defaultProps: {
        children: 'children',
        label: 'text'
      }
    }
  },
  mounted() {
    this.show = true
  },
  methods: {
    handleNodeClick(data) {
      if (data.level > 1) {
        // window.curPageInfo.router.push({
        //   path: window.curPageInfo.router.currentRoute.path + '#' + data.id 
        // })
        location.hash = window.curPageInfo.router.currentRoute.path + '#' + data.id 
      }
    }
  }
})


window.AppSearchComponent = Vue.component('AppSearch', {
  template: `
  <div class="app-search">
  <v-style>
    .app-search   {
      height: 100%;
      display: flex;
      align-items: center;
    }


  </v-style>
  <div style="width: 50px; height: 50px; line-height: 50px; text-align: center"
  @click="openSearch"
  >
  <i class="el-icon-search" ></i>
  </div>

  <el-dialog
  :visible.sync="dialogVisible"
  :append-to-body="true"
  class="search-dialog"
  @closed="onClosed"
  >
        
  <el-autocomplete
  ref="autocom"
  class="inline-input"
  v-model="searchInput"
  :fetch-suggestions="querySearch"
  placeholder="输入搜索文章"
  :trigger-on-focus="false"
  @select="handleSelect"
>
<template slot-scope="{ item }">
<div class="title">{{ item.title }}</div>
</template>
</el-autocomplete>


  </el-dialog>

  </div>
  `,
  data() {
    return {
      searchInput: '',
      restaurants: [],
      dialogVisible: false,
    }
  },
  mounted() {
    this.restaurants = window.articleToc
  },
  methods: {
    openSearch() {
      this.dialogVisible = true
     this.$nextTick(() => {
      this.$refs.autocom.focus()
     })
    },
    hideSearch() {
      this.dialogVisible = false
    },
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.title.toLowerCase().indexOf(queryString.toLowerCase()) > -1);
      };
    },
    handleSelect(item) {
      // console.log(item.link)
      this.dialogVisible = false
      window.curPageInfo.router.push({
        path: item.link
      }).catch(err => {err})
    },
    onClosed() {
      this.searchInput = ''
    }
  }
})