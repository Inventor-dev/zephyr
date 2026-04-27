package xyz.lemone.zephyr.dict.mapper;

import xyz.lemone.zephyr.dict.domain.SysDictData;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface SysDictDataMapper {
    @Select("SELECT * FROM sys_dict_data WHERE dict_type = #{dictType} AND deleted = 0 ORDER BY dict_sort")
    List<SysDictData> selectByDictType(@Param("dictType") String dictType);
    @Insert("INSERT INTO sys_dict_data(dict_type_id,dict_type,dict_label,dict_value,dict_sort,status,remark,deleted) VALUES(#{dictTypeId},#{dictType},#{dictLabel},#{dictValue},#{dictSort},#{status},#{remark},0)")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SysDictData data);
    @Update("UPDATE sys_dict_data SET dict_label=#{dictLabel},dict_value=#{dictValue},dict_sort=#{dictSort} WHERE id=#{id} AND deleted=0")
    int updateById(SysDictData data);
    @Update("UPDATE sys_dict_data SET deleted=1 WHERE id=#{id}")
    int deleteById(@Param("id") Long id);
}
