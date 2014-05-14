
/*  在当前日期基础上加时间
 *  strInterval：s-秒;min-分;h-时;d-天;w-周;q-季;m-月;y-年
 *  如果日期为2012-08-31，加一个月为2012-09-31而9月没有31号就会成为了2012-10-01号
 */ 
 if(!Date.DateAdd){
    Date.prototype.DateAdd = function (strInterval, Number) {
        var dtTmp = this;
        switch (strInterval) {
            case 's': return new Date(Date.parse(dtTmp) + (1000 * Number));
            case 'min': return new Date(Date.parse(dtTmp) + (60000 * Number));
            case 'h': return new Date(Date.parse(dtTmp) + (3600000 * Number));
            case 'd': return new Date(Date.parse(dtTmp) + (86400000 * Number));
            case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
            case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
            case 'y': return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        }
    }
}



/* 转化时间格式
 * 如date.Format("yyyy-MM-dd")  --->2012-01-02
 */
 if(!Date.Format){
    Date.prototype.Format = function (format) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        }
        //RegExpObject.test(string):如果字符串 string 中含有与 RegExpObject 匹配的文本，则返回 true，否则返回 false。
        //   /(y+)/(正则)匹配前面的子表达式一次或多次。例如，'zo+' 能匹配 "zo" 以及 "zoo"，但不能匹配 "z"。+ 等价于 {1,}。
        if (/(y+)/.test(format)) {
            //RegExp.$1表示匹配到的第一个结果(y表示年)
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }
}

/* IE7,IE8对于new Date(2012-01-01)返回NAN,因此写一个使用兼容浏览器的方法
 * DateString格式为2012-01-01
 */
 if(!String.ToDate){
    String.prototype.ToDate = function (ch) {
        var DateString = this;
        ch = ch ? ch : '-';
        var DataArray = DateString.split(ch);
        //new Date(year,month,day,hour,minite,second)中month 0表示1月
        return new Date(DataArray[0], DataArray[1] - 1, DataArray[2], 0, 0, 0);
    }
}




/*
 *  date:2014-05-13
 *  author:picker lee
 *
 *  日期选择控件
 *  调用方法：datePicker(obj,[opts])或者new datePicker(obj,[opts])
 *  参数：
 *      1.obj[DOM对象或者string(ID)]：呼出控件的对象，一般为input[text]，控件只做obj.value的处理
 *      2.opts[对象字面量]:参数配置选项，可为空，参数包括：
 *          a.eventType：呼出控件的事件类型，默认为click
 *          b.dateNames：控件日期头，默认为["日", "一", "二", "三", "四", "五", "六"]
 *          c.dateNameTitles：控件日期头标题，默认为["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
 *          d.monthNames：月份，默认为["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
 *          e.controlTitles：控制按钮SPAN标题
 *          f.yearUnit：年单位：默认年
 *          g.format：日期格式，默认yyyy-MM-dd
 *          h.minDate：最小日期，格式需与format一致，默认空
 *          i.maxDate：最大日期，格式需与format一致，默认空
 *          j.horizontalOffSet：水平偏移量：默认0
 *          k.verticalOffSet：垂直偏移量，默认0
 */
function datePicker(obj,opts){
    if(!(this instanceof datePicker)){
       return new datePicker(obj,opts);
    }
    opts=opts||{};
    this.obj=typeof obj==="string"?document.getElementById(obj):obj;
    
    this.eventType=opts.eventType||"click";
    this.dateNames=opts.dateNames||["日", "一", "二", "三", "四", "五", "六"];
    this.dateNameTitles=opts.dateNameTitles||["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    this.monthNames=opts.monthNames||["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
    this.controlTitles=opts.controlTitles||["prev year", "next year", "prev month", "next month"];
    this.yearUnit=opts.yearUnit|| "年";
    //this.formatChar=opts.formatChar|| "-"; //日期格式，用户暂时不可设置
    this.format=opts.format|| "yyyy-MM-dd";
    this.minDate=opts.minDate|| null;
    this.maxDate=opts.maxDate|| null; 
    //this.manualEnter=opts.manualEnter|| false; 
    //this.showMM=opts.showMM|| false;          
    //this.position=opts.position|| "bottom"; //选择器出现的位置（bottom,left）
    this.horizontalOffSet=opts.horizontalOffSet|| 0; 
    this.verticalOffSet=opts.verticalOffSet|| 0;

    this.currentDate=null;
    this.currentYear=null;
    this.currentMonth=null;

    this.IDS={};

    this.ClassNames={
        dp_box:"ui-base-datepicker-box",
        control_title:"ui_base_datepicker_title",
        prev_year:"dp_prevyear",
        prev_month:"dp_prevmonth",
        next_year:"dp_nextyear",
        next_month:"dp_nextmonth",
        tb_datePicker:"ui_base_datepicker_table",
        td_otherMonth:"othermonth",
        td_currentMonth:"currentmonth",
        td_today:"today",
        td_currentDay:"currentday",
        td_disabled:"disabled"
    };

    this.init();
    
}

datePicker.prototype={
    // 获取当前时间戳
    now:function(){
        return new Date().getTime();
    },

    // 获取16位随机数
    rand:function(){
        return Math.random().toString().substr(2);
    },

    // 初始化，为对象添加监听事件
    init:function(){
        var _this=this,
            obj=_this.obj,
            d_id=this.now()+"-"+this.rand();

        this.IDS.dp_id="dp-"+d_id;
        this.IDS.prev_year="py-"+d_id;
        this.IDS.prev_month="pm-"+d_id;
        this.IDS.next_year="ny-"+d_id;
        this.IDS.next_month="nm-"+d_id;
        this.IDS.closeEventListener="close-"+d_id;
        this.IDS.E1="E1-"+d_id;
        this.IDS.E2="E2-"+d_id;



        EventUtil.addHandler(obj,_this.eventType,function(){
            _this.left=obj.offsetLeft+_this.horizontalOffSet,
            _this.top=obj.offsetTop+obj.offsetHeight+_this.verticalOffSet;

            var cd=obj.value||obj.innerText;

            try{
                cd=cd.ToDate();
                // 下面这个语句验证cd是否符合时间的格式
                if(isNaN(cd.getFullYear())||isNaN(cd.getMonth())||isNaN(cd.getDate()))
                    throw new Error('You have entered a wrong date!');
            }catch(err){
                cd=new Date();
            }

            var y=cd.getFullYear(),
                m=cd.getMonth();

            _this.loadPickerBox(y,m);

            _this.closeFromDoc();

        });


     },

     // 创建日历控件对象，并添加事件监听
     loadPickerBox:function(year,month){
        var dp_box=document.getElementById(this.IDS.dp_id);
            if(!dp_box){
                dp_box=document.createElement("div");
                dp_box.id=this.IDS.dp_id;
                dp_box.className=this.ClassNames.dp_box;

                dp_box.style.top=this.top+"px";
                dp_box.style.left=this.left+"px";

                // 将日历控件添加到body下应该更好
                // this.obj.parentNode.appendChild(dp_box);
                document.body.appendChild(dp_box);

                
                this.eventHanlder(dp_box);
            }

        dp_box.innerHTML=this.loadHtml(year,month);
     },

     // 日历控件内容添加
    loadHtml:function(year,month){
        this.currentYear=year;
        this.currentMonth=month;

        var dp_id=this.dp_id;

        var firstday=new Date(year,month,1,0,0,0),    // first day
            lastday=firstday.DateAdd('m',1).DateAdd('d',-1),// last day
            fd=firstday.getDay(),
            ldate=lastday.getDate();

        // 需要显示的日期数组
        var dates= [];
            
        for(var i=0;i<42;i++){
            dates.push(firstday.DateAdd('d',i-fd));
        }


        // control html
        var h_html=[
                '<!--control bar-->',
                '<div class="'+this.ClassNames.control_title+'">',
                    '<span id="'+this.IDS.prev_year+'" class="'+this.ClassNames.prev_year+'" title="'+this.controlTitles[0]+'"><<</span>',
                    '<span id="'+this.IDS.prev_month+'" class="'+this.ClassNames.prev_month+'" title="'+this.controlTitles[1]+'"><</span>',
                    '<span>'+year+this.yearUnit+'</span>',
                    '<span>'+this.monthNames[month]+'</span>',
                    '<span id="'+this.IDS.next_month+'" class="'+this.ClassNames.next_month+'" title="'+this.controlTitles[2]+'">></span>',
                    '<span id="'+this.IDS.next_year+'" class="'+this.ClassNames.next_year+'" title="'+this.controlTitles[3]+'">>></span>',
                '</div>'];

        // date html
        var b_html=['<!--date content-->','<div><table class="'+this.ClassNames.tb_datePicker+'"><thead><tr>'];
        
        // date head
        for(var i=0;i<=6;i++){
            b_html.push('<th title="'+this.dateNameTitles[i]+'">'+this.dateNames[i]+'</th>');
        }
        b_html.push('</tr></thead><tbody>');
        
        // date body
        // tr
        for(var i=0;i<=5;i++){
            b_html.push('<tr>');
            // td
            for(var j=0;j<=6;j++){
                var date=dates[i*7+j];
                var d1=date.getDate(),
                    d2=date.Format(this.format);

                var td_className="";
                if(date<firstday||date>lastday){
                    td_className=this.ClassNames.td_otherMonth;
                }
                if(firstday<=date&&date<=lastday){
                    td_className=this.ClassNames.td_currentMonth;
                }
                if(date.Format(this.format)==new Date().Format(this.format)){
                    td_className=this.ClassNames.td_today;
                }
                if(this.currentDate&&date.Format(this.format)==this.currentDate){
                    td_className=this.ClassNames.td_currentDay;
                }
                if((this.minDate&&date.Format(this.format)<this.minDate)||(this.maxDate&&date.Format(this.format)>this.maxDate)){
                    td_className=this.ClassNames.td_disabled;
                }

                b_html.push('<td class="'+td_className+'" title="'+d2+'">'+d1+'</td>');

            }
            b_html.push('</tr>');
        }

        b_html.push('</tbody></table>');

        return h_html.join('')+b_html.join('');
    },

    // 日历控件的事件监听
    eventHanlder:function(dp_box){
        var _this=this;

        // datepicker box event
        _this.E1=function(e){_this.closeHanlder1(e);};
        EventUtil.addHandler(dp_box,"click",_this.E1 );      

    },

    // body 监听 点击空白处 关闭日历控件
    closeFromDoc:function(){
        var _this=this;

        _this.E2=function(e){_this.closeHanlder2(e);};
        EventUtil.addHandler(document,"click", _this.E2);

    },

    // 移除日历控件，移除事件监听
    close:function(){
        var dp_box=document.getElementById(this.IDS.dp_id);
        if(dp_box){

            // 此处2个事件移除貌似没起作用
             EventUtil.removeHanlder(dp_box,"click",this.E1);
             EventUtil.removeHanlder(document,"click",this.E2);

            document.body.removeChild(dp_box);
        }
    },

    //日历控件自身事件
    closeHanlder1:function(e){
        var box=document.getElementById(this.IDS.dp_id);

        e=EventUtil.getEvent(e);
        var target=EventUtil.getTarget(e);

        if(!target||!target.nodeName){
            return;
        }

        // 4 control buttons
        if(target.nodeName=="SPAN"){
            if(target.id==this.IDS.prev_year){
              this.currentYear--; 
            }
            else if(target.id==this.IDS.prev_month){
                if(this.currentMonth==0){
                    this.currentMonth=11;
                    this.currentYear--;
                }else{
                    this.currentMonth--;
                }
            }
            else if(target.id==this.IDS.next_year){
                this.currentYear++; 
            }
            else if(target.id==this.IDS.next_month){
                if(this.currentMonth==11){
                    this.currentMonth=0;
                    this.currentYear++;
                }else{
                    this.currentMonth++;
                }
            }
            this.loadPickerBox(this.currentYear,this.currentMonth);
        }

        // dates
        else if(target.nodeName=="TD"){
            // 判断日期是否可选
            if(!this.hasClassName(target,this.ClassNames.td_disabled)){
                //赋值并移除控件
                this.obj.value=target.title;
                this.currentDate=target.title;
                this.close();
            }

        }

    },

    // document点击关闭事件
    closeHanlder2:function(e){
        var box=document.getElementById(this.IDS.dp_id);

        e=EventUtil.getEvent(e);
        var target=EventUtil.getTarget(e);


        /*
         * --TODO
         * 特殊处理-start
         * 此处如果不作此处理，日历控件在点击控制按钮SPAN时会有问题
         * 具体原因还未找出
         */
        if(target&&target.id){
            target=document.getElementById(target.id);
        }
        /* -end- */

        if(target==this.obj||target==box||this.isChildOf(box,target)){
            return;
        }
        this.close();
        
    },

    // 判断el是否为pEl的后备元素
    isChildOf:function(pEl,el){
        var prEl=el.parentNode;
        while(prEl){
            if(prEl==pEl&&prEl!=document)
                return true;
            else
                prEl=prEl.parentNode;
        }
        return false;
    },

    // 判断是否存在样式名
    hasClassName:function(inElement, inClassName){
        var regExp = new RegExp('(?:^|\\s+)' + inClassName + '(?:\\s+|$)');
        return regExp.test(inElement.className);
    },
    // 添加样式名
    addClassName:function(inElement, inClassName){
         if (!hasClassName(inElement, inClassName))
            inElement.className = [inElement.className, inClassName].join(' ');
    },
    // 移除样式名
    removeClassName:function(inElement, inClassName){
        if (hasClassName(inElement, inClassName)) {
            var regExp = new RegExp('(?:^|\\s+)' + inClassName + '(?:\\s+|$)', 'g');
            var curClasses = inElement.className;
            inElement.className = curClasses.replace(regExp, ' ');
        }
    },
    // 添加/移除样式名
    toggleClassName:function(inElement, inClassName){
        if (hasClassName(inElement, inClassName))
            this.removeClassName(inElement, inClassName);
        else
            this.addClassName(inElement, inClassName);
    },
    //  获取元素的样式属性
    getCss: function (elem, cssName) {
        if (elem.style[cssName]) return elem.style[cssName];

        if (elem.currentStyle) return elem.currentStyle[cssName];

        if (document.defaultView && document.defaultView.getComputedStyle)

            return document.defaultView.getComputedStyle(elem, "").getPropertyValue(cssName);
    }
};
