package xyz.lemone.zephyr.auth.mapper;

import xyz.lemone.zephyr.auth.domain.SysUserRole;
import org.apache.ibatis.annotations.*;

import java.util.List;

/**
 * 用户角色关联 Mapper
 */
@Mapper
public interface SysUserRoleMapper {

    @Select("SELECT * FROM sys_user_role WHERE user_id = #{userId}")
    List<SysUserRole> selectByUserId(@Param("userId") Long userId);

    @Insert("INSERT INTO sys_user_role(user_id, role_id, create_time) VALUES(#{userId}, #{roleId}, NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SysUserRole userRole);

    @Delete("DELETE FROM sys_user_role WHERE user_id = #{userId}")
    int deleteByUserId(@Param("userId") Long userId);

    @Delete("DELETE FROM sys_user_role WHERE user_id = #{userId} AND role_id = #{roleId}")
    int deleteByUserIdAndRoleId(@Param("userId") Long userId, @Param("roleId") Long roleId);
}
