/**
 * Created by liuang.cnic on 2015/4/17.
 */
var acceptFileTypes,isSupportFileApi=false;
$(function(){
    if(window.File && window.FileList && window.FileReader&& window.Blob)
        isSupportFileApi=true;
});
$(".upload-dialog-col").slimScroll({
    height: '240px',
    alwaysVisible: true
});
function initialFileUpload(url) {
    $('#fileupload').fileupload();
    $('#fileupload').fileupload({
        autoUpload: false,
        dropZone: $('#dropzone'),
        imagePreviewName: "preview",
        singleFileUploads:true,
        multipart:true,
        maxChunkSize: 10000000,
        limitConcurrentUploads:5,
        limitMultiFileUploads: 5,
        maxFileSize: 50000000,
        messages: {
            maxFileSize: "文件过大，上传文件大小不能超过50M"
        }
    });
    $("#fileupload").fileupload({
        url:url,
        type:"post",
        dataType: "json",
        add: function (e, data) {
            if (e.isDefaultPrevented()) {
                return false;
            }
            if(acceptFileTypes&&acceptFileTypes!=''){
                for(var index=0;index<data.files.length;index++){
                    if(acceptFileTypes&&!(acceptFileTypes.test(data.files[index].type)||acceptFileTypes.test(data.files[index].name))){
                        data.files[index].error="文件类型不正确";
                    }
                }
            }
            //如果浏览器支持html5，计算md5
            if(isSupportFileApi){
                for(var i=0;i<data.files.length;i++){
                    var hash=new hashMe(data.files[i],function(m){
                        console.log(m);
                        data.md5=m;
                    });
                }
            }
            //console.log(data.md5);
            data.process(function () {
                return $("#fileupload").fileupload('process', data);
            });
            data.context = renderUpload(data.files)
                .data("data",data)
                .addClass("processing")
            ;
            $("#fileupload").fileupload('process', data);
            $("#files").append(data.context);
            data.context.each(function (index) {
                $(this).find('.size').text(
                    formatFileSize(data.files[index].size)
                );
            }).removeClass('processing');
            $(".cancel").click(function(e){
                e.preventDefault();
                var template=$(e.currentTarget).closest('.template-upload');
                var data=template.data("data")||{};
                data.context = data.context || template;
                if(data.abort){
                    data.abort();
                }
            });
            $(".start").click(function(e){
                e.preventDefault();
                var template=$(e.currentTarget).closest('.template-upload');
                var data=template.data("data");
                if (data && data.submit) {
                    data.submit();
                }
            });
        },
        submit:function(e,data){
            var fileItem = new EJS({url: ctx + "/resources/js/ejs/upload.ejs"}).render(data);
            data.uploadContext=$(fileItem).data("data",data).addClass("uploading");
            $("#uploadFiles").append(data.uploadContext);

            $(".cancel").click(function(e){
                e.preventDefault();
                var template=$(e.currentTarget).closest('.upload-file-item');
                var data=template.data("data")||{};
                data.uploadContext = data.uploadContext || template;
                if(data.abort){
                    data.abort();
                    template.remove();
                }
                data.sendTime=new Date();
                data.sendSize=0;
                var uploadings = $("#uploadFiles").find(".uploading");
                if (uploadings && uploadings.length > 0) {

                } else {
                    $("#uploadHead").html("上传完成");
                    $("#dialogBody").height("0px");
                    $(".upload-dialog-sys-btn-min").addClass("upload-dialog-sys-btn-max");
                    $("#uploadProgressHead").width("0px");
                }
            });

        },
        progress:function(e,data){
            var progress = Math.floor(data.loaded / data.total * 100);
            if(data.uploadContext){
                data.uploadContext.each(function(){
                    $(this).find(".inline-mask").width(progress+"%");
                    if(progress!=100)
                        $(this).find(".progressing").html(progress+"%("+formatFileSize((data.loaded-data.sendSize)/(new Date()-data.sendTime)*1000)+"/s)");
                    else
                        $(this).find(".progressing").html("处理中...");
                });
            }
            data.sendTime=new Date();
            data.sendSize=data.loaded;
        },
        progressall:function(e,data){
            var progress = Math.floor(data.loaded / data.total * 100);
            $("#uploadProgressHead").width(progress+"%");
        },
        done:function(e,data){

            $("#uploadProgressHead").width("0%");
            if(data.uploadContext){
                data.uploadContext.each(function(){
                    $(this).find(".inline-mask").width("0%");
                    $(this).find(".progressing").empty();
                    $(this).find(".progressing").addClass("upload-dialog-bg");
                    $(this).find(".progressing").addClass("state-txt-btn");
                    $(this).find(".progressing").addClass("state-txt-btn-complete");
                    $(this).find(".cancel").hide();
                    $(this).removeClass("uploading");
                });
            }
            if(data.result.info=="success"){
                $("#uploadHead").html("上传完成");
            }else{
                $("#uploadHead").html(data.result.info);
                bootbox.alert(data.result.info);
            }
        }
    });
}
function renderUpload(files){
    return renderTemplate(
        tmpl("template-upload"),
        files
    );
}
function formatFileSize(bytes){
    if (typeof bytes !== 'number') {
        return '';
    }
    if (bytes >= 1000000000) {
        return (bytes / 1000000000).toFixed(2) + ' GB';
    }
    if (bytes >= 1000000) {
        return (bytes / 1000000).toFixed(2) + ' MB';
    }
    return (bytes / 1000).toFixed(2) + ' KB';
}
function renderTemplate(func,files){
    if (!func) {
        return $();
    }
    var result = func({
        files: files,
        formatFileSize: formatFileSize,
        options: this.options
    });
    if (result instanceof $) {
        return result;
    }
    var templatesContainer = document.createElement(
        $("#files").prop('nodeName')
    );
    return $(templatesContainer).html(result).children();
}