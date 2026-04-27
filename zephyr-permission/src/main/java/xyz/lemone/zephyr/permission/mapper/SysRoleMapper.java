package xyz.lemone.zephyr.permission.mapper;

import xyz.lemone.zephyr.permission.domain.SysRole;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 角色 Mapper
 */
@Mapper
public interface SysRoleMapper {

    @Select("SELECT * FROM sys_role WHERE id = #{id} AND deleted = 0")
    SysRole selectById(@Param("id") Long id);

    @Select("SELECT * FROM sys_role WHERE deleted = 0 ORDER BY role_sort")
    List<SysRole> selectAll();

    @Insert("INSERT INTO sys_role(role_name, role_key, role_sort, status, data_scope, parent_role_id, remark, create_time, deleted) " +
            "VALUES(#{roleName}, #{roleKey}, #{roleSort}, #{status}, #{dataScope}, #{parentRoleId}, #{remark}, NOW(), 0)")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SysRole role);

    @Update("<script>" +
            "UPDATE sys_role SET update_time = NOW()" +
            "<if test='roleName != null'>, role_name = #{roleName}</if>" +
            "<if test='roleKey != null'>, role_key = #{roleKey}</if>" +
            "<if test='roleSort != null'>, role_sort = #{roleSort}</if>" +
            "<if test='status != null'>, status = #{status}</if>" +
            "<if test='dataScope != null'>, data_scope = #{dataScope}</if>" +
            "<if test='parentRoleId != null'>, parent_role_id = #{parentRoleId}</if>" +
            " WHERE id = #{id} AND deleted = 0" +
            "</script>")
    int updateById(SysRole role);

    @Update("UPDATE sys_role SET deleted = 1, update_time = NOW() WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}
