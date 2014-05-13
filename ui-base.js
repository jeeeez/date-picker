/*
*   页面元素的方法支持
*/
var Element = {
    //判断是否存在某样式名
    hasClassName: function (inElement, inClassName) {
        var regExp = new RegExp('(?:^|\\s+)' + inClassName + '(?:\\s+|$)');
        return regExp.test(inElement.className);
    },
    //添加样式
    addClassName: function (inElement, inClassName) {
        if (!hasClassName(inElement, inClassName))
            inElement.className = [inElement.className, inClassName].join(' ');
    },
    //移除样式
    removeClassName: function (inElement, inClassName) {
        if (hasClassName(inElement, inClassName)) {
            var regExp = new RegExp('(?:^|\\s+)' + inClassName + '(?:\\s+|$)', 'g');
            var curClasses = inElement.className;
            inElement.className = curClasses.replace(regExp, ' ');
        }
    },
    //添加/移除样式
    toggleClassName: function (inElement, inClassName) {
        if (hasClassName(inElement, inClassName))
            removeClassName(inElement, inClassName);
        else
            addClassName(inElement, inClassName);
    },
    //  获取元素的样式属性
    getCss: function (elem, cssName) {
        if (elem.style[cssName]) return elem.style[cssName];

        if (elem.currentStyle) return elem.currentStyle[cssName];

        if (document.defaultView && document.defaultView.getComputedStyle)

            return document.defaultView.getComputedStyle(elem, "").getPropertyValue(cssName);
    },
    //  获取文本框被选择的文本
    getSelectedText: function (textbox) {
        if (typeof textbox.selectionStart == "number")  //IE9+，其他
            return textbox.value.substring(textbox.selectionStart, textbox.selection.End);
        else if (document.seletion)     //IE8及以下
        //注意：document.seletion表示整个文档内选择的文本信息，因此不需要参数textbox
            return document.selection.createRange().text;
    },
    //  选择部分文本（例：选择第4到第6个字符——selectText(textbox,4,7);）
    selectText: function (textbox, startIndex, stopIndex) {
        if (arguments.length == 1) {
            //如果只传入textbox，则选择全部文本
            startIndex = 0;
            stopIndex = textbox.value.length;
        } else if (arguments.length == 2) {
            //如果只传入textbox和startIndex，则选择startIndex到最后
            stopIndex = textbox.value.length;
        }

        if (textbox.setSelectionRange)  //IE9+，其他
            textbox.setSelectionRange(startIndex, stopIndex);
        else if (textbox.createTextRange) {//IE8及以下
            var range = textbox.createTextRange();
            range.collapse(true);
            range.moveStart("character", startIndex);
            range.moveEnd("character", stopIndex - startIndex);
            range.select();
        }
        textbox.focus();
    }

};


/*  EventUtil
*   添加（移除）事件，获取事件对象，获取事件目标，取消默认事件，阻止冒泡，获取键码，字符编码
*/
eventHandlesCounter = 1; //计数器，将统计所有添加进去的函数的个数,0位预留作其它用
var EventUtil = {
    //添加事件
    addHandler: function (element, type, handler) {

        if (!handler.__EventID)//__EventID是给函数加的一个标识，见下面给函数添加标识的部分
            handler.__EventID = "e" + eventHandlesCounter++; //使用一个自动增长的计数器作为函数的标识以保证不会重复

        if (!element.__EventHandles)
            element.__EventHandles = []; //当不存在，也就是第一次执行时，创建一个，并且是数组

        if (!element.__EventHandles[type])//将所有事件处理函数按事件类型分类存放
            element.__EventHandles[type] = {}; //当不存在时也创建一个散列表  

        element.__EventHandles[type][handler.__EventID] = handler;

        if (element.addEventListener) //IE9+以及其他
            element.addEventListener(type, handler, false);
        else if (element.attachEvent) //IE6-8
            element.attachEvent("on" + type, handler);
        else //IE5
            element["on" + type] = handler;
    },

    //移除事件
    removeHanlder: function (element, type, handler) {
        if (element.removeEventListener)
            element.removeEventListener(type, handler, false);
        else if (element.detachEvent)
            element.detachEvent("on" + type, handler);
        else
            element["on" + type] = null;
    },

    //移除某类型的所有事件（未经全面测试，慎用），参考资料：http://www.iteye.com/topic/517899
    //尽量使用removeHanlder函数
    removeHanlders: function (element, type) {
        for (var i in element.__EventHandles[type]) {
            this.removeHanlder(element, type, element.__EventHandles[type][i]);
        }
    },

    //获取事件对象
    getEvent: function (event) {
        return event ? event : window.event;
    },

    //获取事件目标，参数event必须是正确的事件对象==》EventUtil.getEvent(event)
    getTarget: function (event) {
        return event.target || event.srcElement;
    },

    //获取事件键盘事件的键码
    getKeyCode: function (event) {
        event = this.getEvent(event);
        return event.keyCode;
    },

    //获取字符编码
    getCharCode: function (event) {
        event = this.getEvent(event);
        if (typeof event.charCode == "number")
            return event.charCode;
        else
            return event.keyCode;
    },

    //取消默认事件，参数event必须是正确的事件对象==》EventUtil.getEvent(event)
    preventDefault: function (event) {
        if (event.preventDefault)
            event.preventDefault();
        else
            event.returnValue = false;
    },

    //阻止冒泡，参数event必须是正确的事件对象==》EventUtil.getEvent(event)
    stopPropagation: function (event) {
        if (event.stopPropagation)
            event.stopPropagation();
        else
            event.cancelBubble = true;
    },

    //  IE浏览器将剪贴板信息保存在window对象中，而其他浏览器保存在event对象中
    //  Opera浏览器不支持javascript操作剪贴板，因此以下两个方法在Opera中无效
    //  获取剪贴板数据
    getClipboardText: function (event) {
        var clipboardData = event.clipboardData || window.clipboardData;
        return clipboardData.getData("text");
    },
    //  设置剪贴板数据
    setClipboardText: function (event, value) {
        if (event.clipboardData)    //  非IE
            return event.clipboardData.setData("text/plain", value);
        else if (window.clipboardData)  //IE
            return window.clipboardData.setData("text", value);
    }
};
