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
          background: transparent;
          font-size: 14px;
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
        console.log('data', data)
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
      margin-top: .6vh
    }
  </v-style>
  <el-autocomplete
  class="inline-input"
  v-model="searchInput"
  :fetch-suggestions="querySearch"
  placeholder="请输入内容"
  :trigger-on-focus="false"
  @select="handleSelect"
>
<template slot-scope="{ item }">
<div class="title">{{ item.title }}</div>
</template>
</el-autocomplete>
  </div>
  `,
  data() {
    return {
      searchInput: '',
      restaurants: []
    }
  },
  mounted() {
    this.restaurants = window.articleToc
  },
  methods: {
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.title.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    handleSelect(item) {
      console.log(item.link)
      window.curPageInfo.router.push({
        path: item.link
      }).catch(err => {err})
    }
  }
})