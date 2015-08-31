package cn.zsmj.service;

import cn.zsmj.dao.FileDao;
import cn.zsmj.entity.FileResource;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.FileAttribute;
import java.util.Map;

/**
 * Created by liuan on 2015/8/31.
 */
@Service
public class FileService {

    @Resource
    private FileDao fileDao;

    public int  saveFileInfoToDb(FileResource resource){
        return fileDao.insert(resource);
    }
    public File saveFileToLocal(String path,String fileName,byte[] bytes) throws IOException {
        Path root=Paths.get(path);
        if(!Files.exists(root)){
            Files.createDirectories(root);
        }
        Path filePath=root.resolve(fileName);
        if(Files.exists(filePath)){
            Files.write(filePath,bytes, StandardOpenOption.APPEND);
        }else{
            Files.write(filePath,bytes,StandardOpenOption.CREATE_NEW);
        }
        return filePath.toFile();
    }
    public FileResource getFileResourceById(String id){
        Map map=fileDao.findById(Integer.getInteger(id));
        if(map==null)
            return null;
        FileResource resource=new FileResource();
        resource.setName(map.get("NAME").toString());
        resource.setSize(Double.parseDouble(map.get("SIZE").toString()));
        resource.setContentType(map.get("CONTENTTYPE").toString());
        resource.setMd5(map.get("MD5").toString());
        return resource;
    }
    public FileResource getFileResourceByMd5(String md5,String contentType,long size){
        Map map=fileDao.findByMd5AndSizeAndContentType(md5,size,contentType);
        if(map==null)
            return null;
        FileResource fileResource=new FileResource();
//        fileResource.setName(map.get("NAME").toString());
        fileResource.setSize(Double.parseDouble(map.get("SIZE").toString()));
        fileResource.setContentType(map.get("CONTENTTYPE").toString());
        fileResource.setMd5(map.get("MD5").toString());
        fileResource.setId(Integer.parseInt(map.get("ID").toString()));
        return fileResource;
    }
    public void updateResource(FileResource resource,String id){
        fileDao.update(resource,Integer.getInteger(id));
    }
}
