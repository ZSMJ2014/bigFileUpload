package dao;

import cn.zsmj.dao.FileDao;
import cn.zsmj.entity.FileResource;
import org.junit.runner.RunWith;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import javax.annotation.Resource;
import java.util.Date;
import java.util.Map;

/**
 * Created by liuan on 2015/8/18.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = {"classpath:applicationContext.xml"})
public class Test {

    @Resource
    private FileDao fileDao;

    @org.junit.Test
    public void testInsert(){
        FileResource fileResource=new FileResource();
        fileResource.setName("123");
        fileResource.setMd5("1wea343asd");
        fileResource.setContentType("application/pdf");
        fileResource.setSize(12);
        fileResource.setUpdateTime(new Date());
        int id=fileDao.insert(fileResource);
        System.out.println(id);
    }
    @org.junit.Test
    public void testFind(){
        Map fileResource=fileDao.findByMd5AndSizeAndContentType("1wea343asd",12,"application/pdf");
        System.out.println(fileResource.get("id"));
    }
}
