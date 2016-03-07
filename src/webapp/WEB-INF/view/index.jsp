<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN">
<html>
<head>
    <meta charset="utf-8">
    <title>${team.name}</title>
    <link rel="stylesheet" href="${ctx}/resources/bundle/bootstrap-3.3.4/css/bootstrap.min.css">
    <link rel="stylesheet" href="${ctx}/resources/bundle/font-awesome-4.2.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="${ctx}/resources/bundle/assets/css/ace.min.css">
    <link rel="stylesheet" href="${ctx}/resources/bundle/assets/css/font-awesome.min.css">
    <link rel="stylesheet" href="${ctx}/resources/bundle/assets/css/datepicker.css"/>
    <link rel="stylesheet" href="${ctx}/resources/bundle/fileupload/css/jquery.fileupload.css">
    <link rel="stylesheet" href="${ctx}/resources/css/upload.css"/>
</head>
<body>

<div class="container">
    <div class="row">
        <div class="col-md-12 col-xs-12 col-lg-12">
            <h4 class="blue center">
                <span class="middle">上传数据</span>
            </h4>

            <form method="post" enctype="multipart/form-data" class="form-horizontal" id="uploadFileForm">

                <div id="meta">
                    <h4 class="header smaller lighter red">
                        数据文件
                        <span class="btn btn-info btn-xs fileinput-button right">
                        <i class="glyphicon glyphicon-plus"></i>
                        <span>添加数据</span>
                        <input type="file" id="fileupload" name="myfiles" multiple>
                        </span>
                    </h4>
                </div>

                <table class="table" id="fileTable">
                    <thead>
                    <tr>
                        <th>文件名称</th>
                        <th>文件大小</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody id="files">

                    </tbody>
                </table>

                <div class="clearfix form-actions">
                    <div class="col-md-offset-3 col-md-9">
                        <button class="btn btn-info" id="uploadAll" type="button">
                            上传数据
                        </button>

                        &nbsp; &nbsp; &nbsp;
                        <button class="btn" type="button" onclick="window.history.go(-1)">
                            取消
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>


<!--上传进度框-->
<div class="upload-dialog fixed-dialog" id="uploadDialog" style="display: none">
    <div class="upload-dialog-head relative upload-dialog-bg border-solid-1">
        <div class="inline-mask" id="uploadProgressHead" style="display: none"></div>
        <a class="upload-dialog-sys-btn upload-dialog-sys-btn-cls right" title="关闭">
            <span class="upload-dialog-bg">关闭</span>
        </a>
        <a class="upload-dialog-sys-btn upload-dialog-sys-btn-min right" title="最小化">
            <span class="upload-dialog-bg">最小化</span>
        </a>
        <h4 class="upload-dialog-h4 clearfix">
            <strong class="left" id="uploadHead">正在上传</strong>
        </h4>
    </div>
    <div class="dlg-bd relative" id="dialogBody">
        <div class="dialog-content clearfix">
            <div class="upload-dialog-col">
                <ul id="uploadFiles">

                </ul>
            </div>
        </div>
    </div>
</div>
<script id="template-upload" type="text/x-tmpl">
{% for (var i=0, file; file=o.files[i]; i++) { %}
    <tr class="template-upload">
        <td>
        <div class="form-group">
            <div class="col-sm-10">
            {%=file.name%}
            </div>
            {% if(file.error){ %}
        <label class="error">{%=file.error%}</label>
        {% } %}
        </div>
        </td>
        <td>
            <p class="size">读取中...</p>
        </td>
        <td>
        <a class="start" style="display:none">
        </a>
                <a class="cancel" href="javascript:void(0)">
                    <i class="icon-trash"></i>
                    <span>取消</span>
                </a>
        </td>
    </tr>
{% } %}



</script>
<script src="${ctx}/resources/js/jquery-1.11.1.min.js"></script>
<script src="${ctx}/resources/bundle/bootstrap-3.3.4/js/bootstrap.min.js"></script>
<script src="${ctx}/resources/js/bootbox.min.js"></script>
<script src="${ctx}/resources/js/jquery.form.min.js"></script>
<script src="${ctx}/resources/bundle/assets/js/jquery.slimscroll.min.js"></script>
<script src="${ctx}/resources/bundle/fileupload/js/vendor/jquery.ui.widget.js"></script>
<script src="${ctx}/resources/bundle/fileupload/js/jquery.fileupload.js"></script>
<script src="${ctx}/resources/bundle/fileupload/js/jquery.fileupload-ui.js"></script>
<script src="${ctx}/resources/bundle/fileupload/js/jquery.iframe-transport.js"></script>
<script src="${ctx}/resources/bundle/fileupload/js/jquery.fileupload-process.js"></script>
<script src="${ctx}/resources/bundle/fileupload/js/jquery.fileupload-validate.js"></script>
<!--[if (gte IE 8)&(lt IE 10)]>
<script src="${ctx}/resources/bundle/fileupload/js/cors/jquery.xdr-transport.js"></script>
<![endif]-->
<script src="${ctx}/resources/bundle/fileupload/js/tmpl.min.js"></script>
<script src="${ctx}/resources/bundle/assets/js/typeahead-bs2.min.js"></script>
<script src="${ctx}/resources/bundle/assets/js/bootstrap-tag.min.js"></script>

<script src="${ctx}/resources/bundle/assets/js/ace.min.js"></script>
<script src="${ctx}/resources/bundle/assets/js/ace-elements.min.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/ejs_production.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/utils/parseDateTime.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/uploadFile.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/md5/md5.js"></script>
<script type="text/javascript" src="${ctx}/resources/js/md5/hash.js"></script>
<script>
    var ctx='${ctx}';
    $(function () {
        initialFileUpload("${ctx}/uploadFile");
        //上传资源
        $("#uploadAll").click(function (e) {
            e.preventDefault();
            if ($("#files").find(".error").length == 0) {
                if ($("#files").find(".start").length > 0) {
                    $("#files").find(".start").click();
                    $("#uploadDialog").show();
                    $("#uploadHead").html("正在上传");
                    var timer = setInterval(function () {
                        var uploadings = $("#uploadFiles").find(".uploading");
                        if (uploadings && uploadings.length > 0) {

                        } else {
                            clearInterval(timer);
                            bootbox.alert("上传成功");
                        }
                    }, 500);
                } else {
                    bootbox.alert("请上传文件");
                }
            }
        });
        //上传进度框的缩小按钮
        $(".upload-dialog-sys-btn-min").click(function (e) {
            e.preventDefault();
            var $this = $(e.currentTarget);
            if ($this.hasClass("upload-dialog-sys-btn-max")) {
                $this.removeClass("upload-dialog-sys-btn-max");
                $("#dialogBody").height("250px");
                $("#uploadProgressHead").hide();
            } else {
                $("#dialogBody").height("0px");
                $this.addClass("upload-dialog-sys-btn-max");
                $("#uploadProgressHead").show();
            }
        });
        //上传进度框的关闭按钮
        $(".upload-dialog-sys-btn-cls").click(function (e) {
            e.preventDefault();
            var uploadings = $("#uploadFiles").find(".uploading");
            if (uploadings && uploadings.length > 0) {
                bootbox.confirm("列表中有未上传完成的文件，确定要放弃上传吗？", function (result) {
                    if (result) {
                        uploadings.each(function () {
                            $(this).find(".cancel").trigger("click");
                        });
                        $("#uploadDialog").hide();
                        $("#uploadFiles").empty();
                    }
                });
            } else {
                $("#uploadDialog").hide();
                $("#uploadFiles").empty();
            }
        });
    });
</script>
</body>
</html>
