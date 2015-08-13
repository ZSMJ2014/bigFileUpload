/**
 * Created by liuang.cnic on 2015/4/22.
 */
function formatFileSize(bytes){
    var b = Number(bytes);
    if (b == NaN) {
        return '';
    }
    if (b >= 1000000000) {
        return (b / 1000000000).toFixed(2) + ' GB';
    }
    if (b >= 1000000) {
        return (b / 1000000).toFixed(2) + ' MB';
    }
    return (b / 1000).toFixed(2) + ' KB';
}