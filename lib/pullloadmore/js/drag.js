(function() {
  function dragUpdate(el, fn, state, dir) {
    /**
     * 参数说明 *
     * el : 传进来，执行拖拽事件的元素。
     * updateDir ：用户自定义的拖拽方向（bottomUpdate:为在底部，上拉拖拽更新/topUpdate:为在顶部，下拉拖拽更新），默认选择bottomUpdate
     * clientH ：屏幕高度
     * scrollH ：这个页面的高度
     * state ：加载状态按钮（显示加载/加载中……
     * stateY ：获取 state 的高度
     * fn 用户自定义的回调函数
     * _startY ：拖拽动作开始的 Y轴坐标
     * _moveY ：拖拽移动的 Y轴坐标
     * _endY ：拖拽结束的 Y轴坐标
     * _touchmoveSwitch ：屏蔽掉touchmove多余的时间，让touchmove触发的过程中，指定函数只执行一次
     **/
    this.el = $(el);
    this.updateDir = dir || 'bottomUpdate';
    this.clientH = document.documentElement.clientHeight;
    this.scrollH = document.body.scrollHeight;
    this.state = $(state);
    this.stateY;
    this.fn = fn;
    this._startY;
    this._moveY;
    this._endY;
    this._touchmoveSwitch=true;
  }
  dragUpdate.prototype.init = function() {
    var _this = this;
    _this.el.on('touchstart touchmove touchend', function(e) {
      _this._eventHandler(e);
    });
    if (!!_this.state) {
      _this.state.html('<span class="ui-refresh-icon"></span><span class="ui-refresh-label">加载更多</span>');
      _this.scrollH = document.body.scrollHeight;
      _this.stateY = _this.state.height();
       _this.state.on('touchend', function(e) {
         e.stopPropagation();
        _this.changeCss('loading');
        _this.fn();
    });
    }
    _this.el.on('loaded',function(){
      if (!!_this.state) {
        console.log('我是结束函数');
        _this.changeCss('loaded');
      }
      _this.scrollH = document.body.scrollHeight
    })
    
  }
  dragUpdate.prototype._startHandler = function(e) {
    this._startY = e.touches[0].pageY;
  }
  dragUpdate.prototype._moveHandler = function(e) {
    this._moveY = e.touches[0].pageY;
  }
  dragUpdate.prototype._endHandler = function(e) {
    this._endY = e.changedTouches[0].pageY;
  }
  dragUpdate.prototype._isOnBottom = function() {
    return ($('body')[0].scrollTop + this.clientH == this.scrollH);
  }
  dragUpdate.prototype._isOnTop = function() {
    return ($('body')[0].scrollTop == 0);
  }
  dragUpdate.prototype._isLoading = function() {
    return (this.updateDir == 'bottomUpdate' && this._isOnBottom() || this.updateDir == 'topUpdate' && this._isOnTop());
  }

  dragUpdate.prototype._isDirRight = function() {
    return ((this._moveY - this._startY) > 0 && this.updateDir == 'topUpdate' || (this._moveY - this._startY) < 0 && this.updateDir == 'bottomUpdate');
  }

  dragUpdate.prototype._isTouchendDo = function() {
    return (this._isLoading()&&((this._endY - this._startY<-20) && this.updateDir == 'bottomUpdate'  ||  (this._endY - this._startY >20 ) && this.updateDir == 'topUpdate'));
  }
 
  dragUpdate.prototype._isClickstate = function() {
    return ((this._startY == this._endY) && (this._startY + this.stateY > this.scrollH && this.updateDir == 'bottomUpdate' || this._isLoading() && this.updateDir == 'topUpdate' && this._startY < this.stateY));
  }
  dragUpdate.prototype.changeCss = function(load_state) {
    switch (load_state) {
      case 'loaded':
        $('.ui-refresh-label').html('加载更多');
        console.log('loaded');
        break;
      case 'loading':
        $('.ui-refresh-label').html('加载中...');
        // console.log('loading');
        break;
      case 'disable':
        $('.ui-refresh-label').html('没有更多内容了');
        break;
    }

  }
  dragUpdate.prototype._eventHandler = function(e,isUiRefresh) {
    var _this = this;
    switch (e.type) {
      /*触屏开始的时候获取最初的位置*/
      case 'touchstart':
        _this._startHandler(e);
        // console.log(_this._startY)
        break;
        /* touchmove 处理加载中过度阶段的css控制显示逻辑。*/
        case 'touchmove':
         _this._moveHandler(e);
          if (_this._isLoading()&&_this._touchmoveSwitch&&_this._isDirRight()) {
            _this._touchmoveSwitch = false;
            /*这里的判断手势方向，
             * 下拉加载： 页面滚动在浏览器的顶部的时候，向下拉处理
             * 上拉加载： 页面滚动在浏览器的顶部的时候，向上拉处理
             * 这里处理是为了避免，在临界点的位置的时候，touchmove触发
             */
            if ( !!_this.state ) {
                _this.changeCss('loading');
            }
          
        }
      break;
      /*触屏结束了之后，清除定时器
       *执行endHandler()；
       */
      case 'touchend':
      /*打开touchmove触发的时候关闭的开关*/
        _this._touchmoveSwitch = true;
        _this._endHandler(e);
        /* 判断点击事件是否在底部刷新的位置*/
        if (_this._isTouchendDo()) {
      
          /*
           *一般的情况下，在touchmove的情况下 显示正在加载的状态
           *当事件只触发touchstart和touchend的时候，就是类似点击的时候，也要触发
           */
          _this.fn();
          
        }
        break;
    }

  }
  /*end  of  _eventHandler*/
  window.dragUpdate = dragUpdate;

})();
