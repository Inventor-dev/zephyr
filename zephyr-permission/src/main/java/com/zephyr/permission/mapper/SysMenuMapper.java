package com.zephyr.permission.mapper;

import com.zephyr.permission.domain.SysMenu;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 菜单 Mapper
 */
@Mapper
public interface SysMenuMapper {

    @Select("SELECT * FROM sys_menu WHERE id = #{id} AND deleted = 0")
    SysMenu selectById(@Param("id") Long id);

    @Select("SELECT * FROM sys_menu WHERE deleted = 0 ORDER BY order_num")
    List<SysMenu> selectAll();

    @Select("SELECT m.* FROM sys_menu m INNER JOIN sys_role_menu rm ON m.id = rm.menu_id WHERE rm.role_id = #{roleId} AND m.deleted = 0")
    List<SysMenu> selectByRoleId(@Param("roleId") Long roleId);

    @Insert("INSERT INTO sys_menu(parent_id, menu_name, menu_type, perms, path, component, icon, order_num, visible, status, perms_type, create_time, deleted) " +
            "VALUES(#{parentId}, #{menuName}, #{menuType}, #{perms}, #{path}, #{component}, #{icon}, #{orderNum}, #{visible}, #{status}, #{permsType}, NOW(), 0)")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SysMenu menu);

    @Update("<script>" +
            "UPDATE sys_menu SET update_time = NOW()" +
            "<if test='menuName != null'>, menu_name = #{menuName}</if>" +
            "<if test='perms != null'>, perms = #{perms}</if>" +
            "<if test='path != null'>, path = #{path}</if>" +
            "<if test='icon != null'>, icon = #{icon}</if>" +
            "<if test='orderNum != null'>, order_num = #{orderNum}</if>" +
            "<if test='visible != null'>, visible = #{visible}</if>" +
            " WHERE id = #{id} AND deleted = 0" +
            "</script>")
    int updateById(SysMenu menu);

    @Update("UPDATE sys_menu SET deleted = 1, update_time = NOW() WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}
