package com.zephyr.system.mapper;

import com.zephyr.system.domain.SysOrg;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SysOrgMapper {

    @Select("SELECT * FROM sys_org WHERE id = #{id} AND deleted = 0")
    SysOrg selectById(@Param("id") Long id);

    @Select("SELECT * FROM sys_org WHERE deleted = 0 ORDER BY order_num")
    List<SysOrg> selectAll();

    @Insert("INSERT INTO sys_org(org_name, parent_id, org_level, org_type, leader, phone, email, status, order_num, create_time, deleted) " +
            "VALUES(#{orgName}, #{parentId}, #{orgLevel}, #{orgType}, #{leader}, #{phone}, #{email}, #{status}, #{orderNum}, NOW(), 0)")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SysOrg org);

    @Update("<script>" +
            "UPDATE sys_org SET update_time = NOW()" +
            "<if test='orgName != null'>, org_name = #{orgName}</if>" +
            "<if test='leader != null'>, leader = #{leader}</if>" +
            "<if test='status != null'>, status = #{status}</if>" +
            " WHERE id = #{id} AND deleted = 0" +
            "</script>")
    int updateById(SysOrg org);

    @Update("UPDATE sys_org SET deleted = 1, update_time = NOW() WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}
