
## 简介

android  uniapp  都会做 java 后端也会
然后再在前端这个专业方向上有更深入的研究

1. 跨平台前端开发 （实现小程序，web端通用，native也部分通用）
2. 提升个人的(前端)工作效率和工作质量
3. 提升用户体验, 通过技术驱动业务, 提升产品价值 -

<a href="/crm/凌柏超-web前端-个人简历2.pdf" download="凌柏超的个人简历">下载个人简历</a>

<xy-tab>
    <xy-tab-content label="自制快速代码编辑器">
      <img src="/articles/images/electron_main.png?v=1" />
    </xy-tab-content>
    <xy-tab-content label="使用编辑器制作的店铺页面 uniapp 架构">
      <div>只写少量代码 大部分靠配置</div>
      <img src="/articles/images/webapp_cart.png" />
    </xy-tab-content>
</xy-tab>


为了能够跨平台支持动态更新  实现了自有的基于js的vm语言 slimjs


```js
// json 表达形式 但是实际上 编译成二进制也是可以的 只不过懒得写  
let programAttrs: any = {
  cssMap: {
    main: {
      assignMents: [
        // ['fun', 'p3', ['fun1', ['p1']]],
        // ['assign', 's111', `@(fetch,['1', '2'])`],
        // ['worker', ['2 > 1'], '__fetch_c1',  '__if_else_empty'],    
        ['assign', 'p1', `(@(lastArg,[1, $gloA1]) + 1) / $gloA1`],
        ['assign', 'p2', `@(str_append,['1', '2'])`],
        ['log', `hello p1: $p1`],
        ['assign', 's1', `(2 > 1) + 2`],
        ['await:assign', '', `@(fetch,['1', '2'])`],
        // ['if', ['$p1 > 1', '$p1 > 0'], '__if_c1', '__if_c2',  '__if_else_empty'],    
        // ['for', [1,2,3,4,5,6,7,8,9,10], ['item', 'index'], '__loop_fun1']
      ],
    },
    fun1: {
      assignMents: [
        ['assign', 'fun1_p1', `($a1 + 1) + 1 + @(lastArg,[1,2,"3"])`],
        // ['assign', 'return', `@(get,["p3"])`],
      ],
      params: [
        'a1',
        'a2'
      ],
      outVars: ['fun1_p1']
    },
    __fetch_c1: {
      assignMents: [
        ['assign', 'f1', `1 + @(lastArg,[1,2,"3"])`],
      ],
      outVars: ['f1']
    },
    __if_c1: {
      assignMents: [
        ['assign', 'p1', `1 + @(lastArg,[1,2,"2"])`],
      ],
      outVars: ['p1']
    },
    __if_c2: {
      assignMents: [
        ['assign', 'p1', `1 + @(lastArg,[1,2,"2"])`],
      ],
      outVars: ['p1']
    },
    __if_else_empty: {
      assignMents: [
      ],
      outVars: []
    },
    __loop_fun1_c1: {
      assignMents: [
        ['log', `hello LOOP_INDEX: $item $index`],
        ['break']
      ],
      outVars: []
    },
    __loop_fun1: {
      assignMents: [
        ['assign', 'p1', `1 + $p1`],
        // ['log', `hello LOOP_ITEM: $item`],
        ['if', ['$index > 5'], '__loop_fun1_c1', '__if_else_empty']
      ],
      outVars: ['p1']
    }
  }
}

```

早期web ui 开发代码
![](assets/images/toolapp1.png)


自己在toml基础上加强 开发了自己的配置语言 mytoml

```toml
# 定义函数
@['name', 'arg0', 'arg1', """a=`arg0`; return = `a`;"""]

a = [1,2]
b = `RUN('customFun')`
c = `RUN('name', b, 2)`

temp_targets = { cpu = 79.5, case = 72.0 }

d = 0
each[a, """ d=`d+1`; """]

# result: {"a":[1,2],"b":"customRet","c":"customRet","temp_targets":{"cpu":79.5,"case":72},"d":2}
```


## 自我

1. 前端博客链接
   
   [https://segmentfault.com/u/andypinet](https://segmentfault.com/u/andypinet)
   
   [https://zhuanlan.zhihu.com/c_114049504](https://zhuanlan.zhihu.com/c_114049504)

2. 熟悉使用vue 和 layui  
   熟悉使用elementui
   熟悉使用vant 

3. 熟悉微信小程序开发流程

## 后端

### spring 

1. spring hello
2. spring mysql
3. spring mybatis
   1. 关联查询
4. spring data jpa
   1. 列表查询
5. spring jwt



