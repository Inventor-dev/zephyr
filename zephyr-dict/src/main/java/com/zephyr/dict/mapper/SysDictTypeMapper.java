package com.zephyr.dict.mapper;

import com.zephyr.dict.domain.SysDictType;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface SysDictTypeMapper {
    @Select("SELECT * FROM sys_dict_type WHERE id = #{id} AND deleted = 0")
    SysDictType selectById(@Param("id") Long id);
    @Select("SELECT * FROM sys_dict_type WHERE deleted = 0")
    List<SysDictType> selectAll();
    @Insert("INSERT INTO sys_dict_type(dict_name,dict_type,status,remark,create_time,deleted) VALUES(#{dictName},#{dictType},#{status},#{remark},NOW(),0)")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SysDictType dict);
    @Update("UPDATE sys_dict_type SET dict_name=#{dictName},update_time=NOW() WHERE id=#{id} AND deleted=0")
    int updateById(SysDictType dict);
    @Update("UPDATE sys_dict_type SET deleted=1,update_time=NOW() WHERE id=#{id}")
    int deleteById(@Param("id") Long id);
}
