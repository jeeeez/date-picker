date-picker
===========

/*
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


log：2014-05-13
待解决问题：
  1.IE6，7中定位不准确
  2.控件使用absolute定位，且在DOM树中的位置为obj的兄弟节点，应该将其直接附属于body较好
  3.能否手动输入日期未做
  4.控件中有个特殊处理，在--TODO中，虽然已做处理，但是问题未根治
