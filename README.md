### 基础部分
1. 基础 API：需要提供 kiple.xxx() 供web调用native的能力
2. 基础组件：框架仅允许内置的组件，div等组件不允许使用
3. 框架: 整合基础组件+API,并提供整体的一些调用方式，依次进行页面的渲染
4. 编译器：将页面编译为一个js文件
5. 运行时：先加载框架，然后加载编译后的业务文件

### 运行时的框架
1. 编译基础API，保存为文件 service.js
  - 基础API
  - 生命周期
  - 和 webview.js 进行通讯
  - 需要创建一个全局状态，保存Page.options,通过这个可以知道内存中含有多少个webview
2. 编译基础组件，保存为文件 webview.js
  - 需要将组件编译为 AST, 进行保存
  - 需要一个解析 AST 并进行渲染的函数
  - 和 service.js 进行通讯
3. 创建一个组件管理的框架
  - 注册组件，创建组件，组件的diff
4. 运行时的html执行顺序
  - 加载空的page.html
  - 加载框架
    - 加载组件样式 webview.css(全局样式)
    - 加载组件库 webview.js(组件及组件样式，进行page.html的初始化)
    - 加载能力库 core.js(api)
  - 加载 page-style.js(项目的样式文件,css等都会转换成js，然后使用js插入到元素的style标签中，rpx转换为number，然后根据页面大小转换为px,px不变，可以将这个文件和下一个文件合并)
  - 加载 page-ui.js(项目的视图层代码，可以和上个文件进行合并)，这个文件中初始化页面
  - 加载 page-server.js(项目的业务逻辑，项目配置等信息)
  ```js
  setTimeout(function () {
    if (typeof jSCore === 'object' && typeof jSCore.onDocumentReady === 'function') {
      jSCore.onDocumentReady();
    } else {
      console.log('初始化失败');
    }
  }, 0);
  ```
5. 运行js的顺序
  - 加载完page-server.js后，开支执行App(options)，执行onDocumentReady，
  - 先执行全局的函数
  - 在执行页面函数，执行onLoad后，确定当前页面的data
  - 获取当前页面的渲染函数，加上初始化的data
  - 执行renderPage函数，传入render和data，父节点，渲染页面
  - 当data发生改变，再次执行renderPage
  
### 编译器
1. 需要一个config文件配置页面属性
2. AST编译器: 将每个页面进行AST编译


### Other
1. 在H5端，是否应该在worker中运行js，这样的话，就可以和webview中一样，视图层和逻辑层分离
2. 在编译后的UI中，如何绑定状态？
  ```js
    const test = (pageData) => {
      const count = getData('count', pageData); // pageData('count') => 通过一个getData的函数获取，getData 应该是从 Page(options) 中暴露出来的
      return createElement('wx-button', null, count);
    }
  ```


### 这个阶段的任务时处理事件(4.30)
1. 如何处理tap事件和longtap事件？触发longtap后不能触发tap
2. 如何将tap事件绑定到元素上？
3. 视图层触发事件后，如何将事件的结果返回到逻辑层？(暂时pending，先处理App的启动，然后开发bridge功能)

### 这个阶段需要处理下jsBridge
1. view和service进行交互
2. 需要初始化bridge的时候，初始化一些需要监听的事件，当监听到view层发送的事件，那么需要触发对应的回调函数
3. setData 修改后，重新渲染页面

### 这个阶段开始重新处理组件的状态（5.8）
1. Button 组件的disabled属性，在loading和tap的时候
2. 组件的属性绑定，属性变化时的监听
3. 处理 View 组件

### 这个阶段处理App启动(5.12)
1. 需要将各页面导出方法。绑定到全局对象中
2. 需要有一个全局的变量,保存所有已经开启了的webview
3. app.js 的生命周期
4. page的部分生命周期(onShow,onLoad,onHide,onUnload,没有实现完全，后面统一封装生命周期的方法吧)
5. 路由跳转(先使用html节点全部替换)
6. 系统log使用统一格式
7. 处理用用启动
  ```js
  /**
   * init 的逻辑
   * 1. 通知 view 层执行初始化逻辑：获取入口的path
   * 2. 生成 webviewId,初始值为0，现在变为1（+1），webviewId 是 view 层控制的
   * 3. 根据 path 创建 Page, 将 Page 添加到 webview 的 AppPages 里面
   * 5. 通知 service 层，注册 page，这个时候，如果 AppPages 有page直接使用，没有的话需要引入对应路由的逻辑代码，将将逻辑代码添加到 service 层里面的 AppPages 中
   * 6. 执行 onload 生命周期
   * 7. 通知 view 层渲染页面[RENDER_PAGE]，传递 {data,path},webviewId, view层可以根据data,webviewId,path，获得渲染函数，然后就可以结合data进行渲染了
   * 8. 执行 onShow 生命周期
   * 9. 思考： 创建预加载的 page（webview）应该是谁创建的，这个谁就是维护 webviewId 的那一方
   */
  ```
### 处理页面样式(5.18)
1. 处理 page 组件，需要有title，下拉刷新
2. 加载页面 css，计算 rpx.

### api做参数检验