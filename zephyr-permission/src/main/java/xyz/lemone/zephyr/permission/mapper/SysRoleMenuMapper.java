package xyz.lemone.zephyr.permission.mapper;

import xyz.lemone.zephyr.permission.domain.SysRoleMenu;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 角色菜单关联 Mapper
 */
@Mapper
public interface SysRoleMenuMapper {

    @Select("SELECT * FROM sys_role_menu WHERE role_id = #{roleId}")
    List<SysRoleMenu> selectByRoleId(@Param("roleId") Long roleId);

    @Insert("INSERT INTO sys_role_menu(role_id, menu_id) VALUES(#{roleId}, #{menuId})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SysRoleMenu roleMenu);

    @Delete("DELETE FROM sys_role_menu WHERE role_id = #{roleId}")
    int deleteByRoleId(@Param("roleId") Long roleId);

    @Delete("DELETE FROM sys_role_menu WHERE role_id = #{roleId} AND menu_id = #{menuId}")
    int deleteByRoleIdAndMenuId(@Param("roleId") Long roleId, @Param("menuId") Long menuId);
}
