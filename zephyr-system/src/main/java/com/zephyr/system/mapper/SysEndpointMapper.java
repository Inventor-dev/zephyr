package com.zephyr.system.mapper;

import com.zephyr.system.domain.SysEndpoint;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SysEndpointMapper {

    @Select("SELECT * FROM sys_endpoint WHERE id = #{id} AND deleted = 0")
    SysEndpoint selectById(@Param("id") Long id);

    @Select("SELECT * FROM sys_endpoint WHERE app_code = #{appCode} AND deleted = 0")
    SysEndpoint selectByAppCode(@Param("appCode") String appCode);

    @Select("SELECT * FROM sys_endpoint WHERE deleted = 0 ORDER BY order_num")
    List<SysEndpoint> selectAll();

    @Insert("INSERT INTO sys_endpoint(app_name, app_code, app_logo, app_description, layout_type, theme_config, status, order_num, create_time, deleted) " +
            "VALUES(#{appName}, #{appCode}, #{appLogo}, #{appDescription}, #{layoutType}, #{themeConfig}, #{status}, #{orderNum}, NOW(), 0)")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SysEndpoint endpoint);

    @Update("<script>" +
            "UPDATE sys_endpoint SET update_time = NOW()" +
            "<if test='appName != null'>, app_name = #{appName}</if>" +
            "<if test='appLogo != null'>, app_logo = #{appLogo}</if>" +
            "<if test='appDescription != null'>, app_description = #{appDescription}</if>" +
            "<if test='layoutType != null'>, layout_type = #{layoutType}</if>" +
            "<if test='themeConfig != null'>, theme_config = #{themeConfig}</if>" +
            "<if test='status != null'>, status = #{status}</if>" +
            " WHERE id = #{id} AND deleted = 0" +
            "</script>")
    int updateById(SysEndpoint endpoint);

    @Update("UPDATE sys_endpoint SET deleted = 1, update_time = NOW() WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}
