
####  dragUpdate组件
根据配置符合条件的（上拉/下拉），调用执行回调函。
初始化对象，配置如下
example ：
```js
  var dragUpdateObj = new dragUpdate(el, fn, state, dir);
  var uiRefresh = $('.ui-refresh'),
    state = $('.ui-refresh-down');
 var elDrag = new dragUpdate(uiRefresh,
            function(){
                setTimeout(function(){
                    console.log('我是执行函数（外部传进来的函数执行）');
                    uiRefresh.trigger('loaded')
                },300)
        },state,'bottomUpdate');
    elDrag.init();
```
el ： 传进来的一个参数，是监听 （上拉/下拉）事件的 dom 元素（必选）

fn ： 回调函数，执行完（上拉/下拉）事件，要执行的回调函数。（必选）
fn回调的要求 ： 需要在回调函数最后的执行位置
（如果是异步jsonp的回调函数，不能写在回调函数外面，而是写在回调函数里面执行的最后位置）给元素绑定tregger事件，example ： uiRefresh.trigger('loaded')

state : 传进去 显示 加载/加载中 的状态的按钮。（可选）

dir ：自定义上拉加载还是下拉加载，默认是底部上拉 。（可选）
