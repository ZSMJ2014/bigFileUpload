/**
 * Created by liuang.cnic on 2015/4/17.
 */
var acceptFileTypes, isSupportFileApi = false;
var maxChunkSize = 10000000;
$(".upload-dialog-col").slimScroll({
    height: '240px',
    alwaysVisible: true
});
$(function () {
    if (window.File && window.FileList && window.FileReader && window.Blob) {
        isSupportFileApi = true;
    }
});
function initialFileUpload(url, createDataSet) {
    $('#fileupload').fileupload();
    $('#fileupload').fileupload({
        autoUpload: false,
        dropZone: $('#dropzone'),
        imagePreviewName: "preview",
        singleFileUploads:true,
        multipart:true,
        limitConcurrentUploads:5,
        limitMultiFileUploads: 5,
        maxFileSize: 1000000000,
        maxChunkSize: maxChunkSize,
        maxRetries: 100,
        retryTimeout: 500,
        messages: {
            maxFileSize: "文件过大，上传文件大小不能超过50M"
        }
    });
    $("#fileupload").fileupload({
        url:url,
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
            //大文件上传，并且浏览器支持HTML5，计算文件md5并查询是否已经上传部分数据，如果上传了部分数据，就从断点上传
            if (isSupportFileApi && data.files[0].size > maxChunkSize) {
                var hash = new hashMe(data.files[0], function (md5) {
                    var fileType = data.files[0].type;
                    if (data.files[0].type)
                        fileType = data.files[0].type;
                    else {
                        var filename = data.files[0].name;
                        if (filename.lastIndexOf(".") > 0 && filename.lastIndexOf(".") != filename.length - 1)
                            fileType = filename.substring(filename.lastIndexOf(".") + 1);
                    }
                    data.fileType = fileType;
                    $.ajax({
                        url: ctx + "/getFileUploadedSize",
                        type: "get",
                        data: {md5: md5, fileType: fileType, fileSize: data.files[0].size},
                        success: function (result) {
                            if (result && result.size) {
                                data.uploadedBytes = result.size;
                            }
                            data.objectId = result.id;
                        },
                        complete: function () {
                            data.md5 = md5;
                            parseData(data, createDataSet);
                        }
                    });
                });
            } else {
                parseData(data, createDataSet);
            }

        },
        submit:function(e,data){
            data.formData={};
            if (data.objectId)
                data.formData.objectId = data.objectId;
            data.parentName=$("#uploadFileForm input[name='name']").val();
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
        },
        fail: function (e, data) {
            // jQuery Widget Factory uses "namespace-widgetname" since version 1.10.0:
            var fu = $(this).data('blueimp-fileupload') || $(this).data('fileupload'),
                retries = data.context.data('retries') || 0,
                retry = function () {
                    $.getJSON(ctx +"/getFileUploadedSize", {
                        md5: data.md5,
                        fileType: data.fileType,
                        fileSize: data.files[0].size
                    })
                        .done(function (result) {
                            data.uploadedBytes = result.size;
                            // clear the previous data:
                            data.data = null;
                            data.submit();
                        })
                        .fail(function () {
                            fu._trigger('fail', e, data);
                        });
                };
            if (data.errorThrown !== 'abort' &&
                data.uploadedBytes < data.files[0].size &&
                retries < fu.options.maxRetries) {
                retries += 1;
                data.context.data('retries', retries);
                window.setTimeout(retry, retries * fu.options.retryTimeout);
                return;
            }
            data.context.removeData('retries');
            $.blueimp.fileupload.prototype
                .options.fail.call(this, e, data);
        }
    });
}
function parseData(data, createDataSet) {
    data.process(function () {
        return $("#fileupload").fileupload('process', data);
    });
    data.context = renderUpload(data.files)
        .data("data", data)
        .addClass("processing")
    ;
    $("#fileupload").fileupload('process', data);
    $("#files").append(data.context);
    data.context.each(function (index) {
        $(this).find('.size').text(
            formatFileSize(data.files[index].size)
        );
    }).removeClass('processing');
    if (createDataSet) {
        if ($("#files tr").length > 0) {
            $("#fileTable").show();
            $("#uploadAll").html("创建并上传数据");
        }
    }
    $(".cancel").click(function (e) {
        e.preventDefault();
        var template = $(e.currentTarget).closest('.template-upload');
        var data = template.data("data") || {};
        data.context = data.context || template;
        if (data.abort) {
            data.abort();
        }
        if (createDataSet) {
            if ($("#files tr").length == 0) {
                $("#fileTable").hide();
                $("#uploadAll").html("创建");
            }
        }
    });
    $(".start").click(function (e) {
        e.preventDefault();
        var template = $(e.currentTarget).closest('.template-upload');
        var data = template.data("data");
        if (data && data.submit) {
            data.submit();
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