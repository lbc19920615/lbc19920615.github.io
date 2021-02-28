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
            top:  var(--header-height);
          }
        }


        .toc-tree .el-tree {
          background: transparent;
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