package com.zephyr.form.mapper;

import com.zephyr.form.domain.FormData;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface FormDataMapper {
    @Select("SELECT * FROM form_data WHERE form_definition_id = #{formDefId}")
    List<FormData> selectByFormDefId(@Param("formDefId") Long formDefId);
    @Insert("INSERT INTO form_data(form_definition_id,form_data,submit_user_id,status,create_time) VALUES(#{formDefinitionId},#{formData},#{submitUserId},#{status},NOW())")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(FormData data);
    @Update("UPDATE form_data SET form_data=#{formData},update_time=NOW() WHERE id=#{id}")
    int updateById(FormData data);
    @Delete("DELETE FROM form_data WHERE id=#{id}")
    int deleteById(@Param("id") Long id);
}
