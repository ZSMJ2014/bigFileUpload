package cn.zsmj.controller;

import cn.zsmj.entity.FileResource;
import cn.zsmj.service.FileService;
import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

/**
 * Created by liuan on 2015/8/12.
 */
@Controller
public class PageController {
    @Resource
    private FileService fileService;
    @RequestMapping("/")
    public String index(){
        return "index";
    }
    @RequestMapping(value = "uploadFile",method = RequestMethod.POST)
    @ResponseBody
    public Map uploadFile(MultipartHttpServletRequest request,HttpServletResponse response) throws IOException {
        List<MultipartFile> files=request.getFiles("myfiles");
        Map<String,String> result=new HashMap<String, String>();
        String uploadPath=request.getSession().getServletContext().getRealPath("/upload");
        for(MultipartFile file:files){
            if(file.isEmpty())
                continue;
            //分段上传的处理
            if(request.getParameter("id")!=null){
                String id=request.getParameter("id");
                String contentRange=request.getHeader("Content-Range");
                String fileSizeString=contentRange.substring(contentRange.lastIndexOf("/") + 1);
                File file1=fileService.saveFileToLocal(uploadPath,id+"_"+file.getOriginalFilename(),file.getBytes());
                if(file1.length()==Double.parseDouble(fileSizeString)){
                    FileResource fileResource=fileService.getFileResourceById(id);
                    fileResource.setContentType(file.getContentType());
                    fileResource.setUpdateTime(new Date());
                    fileService.updateResource(fileResource,id);
                }
            }else{//小文件上传
                FileResource fileResource=new FileResource();
                fileResource.setName(file.getOriginalFilename());
                fileResource.setContentType(file.getContentType());
                fileResource.setSize(file.getSize());
                fileResource.setUpdateTime(new Date());
                int id=fileService.saveFileInfoToDb(fileResource);
                fileService.saveFileToLocal(uploadPath,String.valueOf(id),file.getBytes());
            }
        }
        result.put("info","success");
        return result;
    }
    @RequestMapping("getFileUploadedSize")
    @ResponseBody
    public Map<String,String> getFileUploadedSize(String md5,String fileType,@RequestParam("fileSize") long size,HttpServletRequest request){
        FileResource resource=fileService.getFileResourceByMd5(md5,fileType,size);
        Map<String,String> map=new HashMap<String, String>();
        if(resource!=null){
            String uploadPath=request.getSession().getServletContext().getRealPath("/upload");
            File file=new File(uploadPath,resource.getId()+"_"+resource.getName());
            if(file.exists()&&file.isFile())
                map.put("size",String.valueOf(file.length()));
            map.put("id",String.valueOf(resource.getId()));
        }else{
            resource=new FileResource();
            resource.setSize(size);
            resource.setContentType(fileType);
            resource.setMd5(md5);
            resource.setUpdateTime(new Date());
            int id=fileService.saveFileInfoToDb(resource);
            map.put("id",String.valueOf(id));
        }
        return map;
    }
}
