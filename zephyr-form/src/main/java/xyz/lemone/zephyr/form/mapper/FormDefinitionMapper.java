package xyz.lemone.zephyr.form.mapper;

import xyz.lemone.zephyr.form.domain.FormDefinition;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface FormDefinitionMapper {
    @Select("SELECT * FROM form_definition WHERE id = #{id} AND deleted = 0")
    FormDefinition selectById(@Param("id") Long id);
    @Select("SELECT * FROM form_definition WHERE deleted = 0")
    List<FormDefinition> selectAll();
    @Insert("INSERT INTO form_definition(form_name,form_code,description,form_config,status,version,create_user_id,create_time,deleted) VALUES(#{formName},#{formCode},#{description},#{formConfig},#{status},#{version},#{createUserId},NOW(),0)")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(FormDefinition def);
    @Update("<script>UPDATE form_definition SET update_time=NOW()<if test='formConfig != null'>,form_config=#{formConfig}</if><if test='status != null'>,status=#{status}</if> WHERE id=#{id} AND deleted=0</script>")
    int updateById(FormDefinition def);
    @Update("UPDATE form_definition SET deleted=1,update_time=NOW() WHERE id=#{id}")
    int deleteById(@Param("id") Long id);
}
