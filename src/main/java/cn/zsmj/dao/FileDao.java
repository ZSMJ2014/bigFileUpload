package cn.zsmj.dao;

import cn.zsmj.entity.FileResource;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import javax.annotation.Resource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Created by liuan on 2015/8/18.
 */
@Repository
public class FileDao {
    @Resource
    private JdbcTemplate jdbcTemplate;

    public void initDatabase(){
        jdbcTemplate.execute("DROP TABLE IF EXISTS file");
        jdbcTemplate.execute("CREATE TABLE file(ID INT AUTO_INCREMENT PRIMARY KEY,NAME VARCHAR(255),MD5 VARCHAR(255),SIZE DOUBLE,CONTENTTYPE VARCHAR(255),UPDATETIME DATETIME)");
    }

    public int insert(final FileResource fileResource){
        final String sql="insert into file(name,md5,size,contenttype,updatetime) values(?,?,?,?,?)";
        KeyHolder keyHolder=new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreator() {
            public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {

                PreparedStatement ps = connection.prepareStatement(sql, new String[]{"ID"});
//                ps=connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
                ps.setString(1, fileResource.getName());
                ps.setString(2, fileResource.getMd5());
                ps.setDouble(3, fileResource.getSize());
                ps.setString(4, fileResource.getContentType());
                ps.setString(5, new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(fileResource.getUpdateTime()));
                return ps;
            }
        }, keyHolder);
        return keyHolder.getKey().intValue();
//        jdbcTemplate.update(sql, fileResource.getName(), fileResource.getMd5(), fileResource.getSize(), fileResource.getContentType(), fileResource.getUpdateTime());
    }

    public Map findByMd5AndSizeAndContentType(String md5,double size,String contentType){
        String sql="select * from file where md5=? and size=? and contenttype=?";
        List<Map<String,Object>> list=jdbcTemplate.queryForList(sql, md5, size, contentType);
        if(list==null||list.size()==0)
            return null;
        else
            return list.get(0);
    }

    public Map findById(int id){
        String sql="select * from file where id=?";
        List<Map<String,Object>> list=jdbcTemplate.queryForList(sql,id);
        if(list==null||list.size()==0)
            return null;
        else
            return list.get(0);
    }

    public void update(FileResource resource,int id){
        String sql="update file set CONTENTTYPE=? AND UPDATETIME=? where id=?";
        jdbcTemplate.update(sql,resource.getContentType(),resource.getUpdateTime(),id);
    }
}
