package xyz.lemone.zephyr.system.mapper;

import xyz.lemone.zephyr.system.domain.SysDept;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface SysDeptMapper {

    @Select("SELECT * FROM sys_dept WHERE id = #{id} AND deleted = 0")
    SysDept selectById(@Param("id") Long id);

    @Select("SELECT * FROM sys_dept WHERE deleted = 0 ORDER BY order_num")
    List<SysDept> selectAll();

    @Select("SELECT * FROM sys_dept WHERE org_id = #{orgId} AND deleted = 0")
    List<SysDept> selectByOrgId(@Param("orgId") Long orgId);

    @Insert("INSERT INTO sys_dept(dept_name, parent_id, ancestors, org_id, leader, phone, email, status, order_num, create_time, deleted) " +
            "VALUES(#{deptName}, #{parentId}, #{ancestors}, #{orgId}, #{leader}, #{phone}, #{email}, #{status}, #{orderNum}, NOW(), 0)")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SysDept dept);

    @Update("<script>" +
            "UPDATE sys_dept SET update_time = NOW()" +
            "<if test='deptName != null'>, dept_name = #{deptName}</if>" +
            "<if test='leader != null'>, leader = #{leader}</if>" +
            "<if test='status != null'>, status = #{status}</if>" +
            " WHERE id = #{id} AND deleted = 0" +
            "</script>")
    int updateById(SysDept dept);

    @Update("UPDATE sys_dept SET deleted = 1, update_time = NOW() WHERE id = #{id}")
    int deleteById(@Param("id") Long id);
}
