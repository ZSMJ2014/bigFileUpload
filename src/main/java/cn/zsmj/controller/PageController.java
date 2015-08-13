package cn.zsmj.controller;

import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;

/**
 * Created by liuan on 2015/8/12.
 */
@Controller
public class PageController {
    @RequestMapping("/")
    public String index(){
        return "index";
    }
    @RequestMapping(value = "/upload",method = RequestMethod.POST)
    @ResponseBody
    public
     String uploadFile(HttpServletRequest request,HttpServletResponse response) throws IOException {
        request.getHeader("content-range");//Content-Range:bytes 737280-819199/845769
        request.getHeader("content-length"); //845769
        request.getHeader("content-disposition"); // Content-Disposition:attachment; filename="Screenshot%20from%202012-12-19%2017:28:01.png"
        request.getInputStream(); //actual content.;
        return "1";
    }
}
