/**
 * Created by liuang.cnic on 2015/4/10.
 */
function curDate(d){
    var year = d.getYear()+1900;
    var month = d.getMonth()+1;
    var date = d.getDate();
    var curDateTime= year;
    if(month>9)
        curDateTime = curDateTime +"/"+month;
    else
        curDateTime = curDateTime +"/0"+month;
    if(date>9)
        curDateTime = curDateTime +"/"+date;
    else
        curDateTime = curDateTime +"/0"+date;
    return curDateTime;
}
function curTime(d){
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var curDateTime;
    if(hours>9)
        curDateTime =hours;
    else
        curDateTime ="0"+hours;
    if(minutes>9)
        curDateTime = curDateTime +":"+minutes;
    else
        curDateTime = curDateTime +":0"+minutes;
    return curDateTime;
}
function parseDateTime(d){
    var datetime=new Date(d);
    return curDate(datetime)+" "+curTime(datetime);
}