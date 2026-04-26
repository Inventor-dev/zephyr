package com.zephyr.log.mapper;

import com.zephyr.log.domain.SysOperLog;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface SysOperLogMapper {
    @Insert("INSERT INTO sys_oper_log(module,description,oper_type,method,request_method,request_url,request_param,response_result,oper_user_id,oper_username,oper_ip,status,error_msg,cost_time,oper_time) " +
            "VALUES(#{module},#{description},#{operType},#{method},#{requestMethod},#{requestUrl},#{requestParam},#{responseResult},#{operUserId},#{operUsername},#{operIp},#{status},#{errorMsg},#{costTime},#{operTime})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SysOperLog log);
    @Select("SELECT * FROM sys_oper_log ORDER BY oper_time DESC")
    List<SysOperLog> selectAll();
    @Select("SELECT * FROM sys_oper_log WHERE module = #{module} ORDER BY oper_time DESC")
    List<SysOperLog> selectByModule(@Param("module") String module);
}
