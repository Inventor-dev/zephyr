package xyz.lemone.zephyr.auth.mapper;

import xyz.lemone.zephyr.auth.domain.SysUser;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 用户 Mapper（Fluent-MyBatis 风格）
 */
@Mapper
public interface SysUserMapper {

    @Select("SELECT * FROM sys_user WHERE id = #{id} AND deleted = 0")
    SysUser selectById(@Param("id") Long id);

    @Select("SELECT * FROM sys_user WHERE username = #{username} AND deleted = 0")
    SysUser selectByUsername(@Param("username") String username);

    @Select("SELECT * FROM sys_user WHERE deleted = 0 ORDER BY create_time DESC")
    List<SysUser> selectAll();

    @Insert("INSERT INTO sys_user(username, password, nickname, email, phone, org_id, dept_id, status, create_by, create_time, deleted) " +
            "VALUES(#{username}, #{password}, #{nickname}, #{email}, #{phone}, #{orgId}, #{deptId}, #{status}, #{createBy}, NOW(), 0)")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SysUser user);

    @Update("<script>" +
            "UPDATE sys_user SET update_time = NOW()" +
            "<if test='nickname != null'>, nickname = #{nickname}</if>" +
            "<if test='email != null'>, email = #{email}</if>" +
            "<if test='phone != null'>, phone = #{phone}</if>" +
            "<if test='avatar != null'>, avatar = #{avatar}</if>" +
            "<if test='status != null'>, status = #{status}</if>" +
            "<if test='orgId != null'>, org_id = #{orgId}</if>" +
            "<if test='deptId != null'>, dept_id = #{deptId}</if>" +
            " WHERE id = #{id} AND deleted = 0" +
            "</script>")
    int updateById(SysUser user);

    @Update("UPDATE sys_user SET deleted = 1, update_time = NOW() WHERE id = #{id}")
    int deleteById(@Param("id") Long id);

    @Select("SELECT * FROM sys_user WHERE org_id = #{orgId} AND deleted = 0")
    List<SysUser> selectByOrgId(@Param("orgId") Long orgId);
}
