package xyz.lemone.zephyr.job.mapper;

import xyz.lemone.zephyr.job.domain.SysJob;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface SysJobMapper {
    @Select("SELECT * FROM sys_job WHERE id = #{id} AND deleted = 0")
    SysJob selectById(@Param("id") Long id);
    @Select("SELECT * FROM sys_job WHERE deleted = 0")
    List<SysJob> selectAll();
    @Insert("INSERT INTO sys_job(job_name,job_group,cron_expression,invoke_target,misfire_policy,concurrent,status,remark,create_time,deleted) VALUES(#{jobName},#{jobGroup},#{cronExpression},#{invokeTarget},#{misfirePolicy},#{concurrent},#{status},#{remark},NOW(),0)")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SysJob job);
    @Update("<script>UPDATE sys_job SET update_time=NOW()<if test='jobName != null'>,job_name=#{jobName}</if><if test='cronExpression != null'>,cron_expression=#{cronExpression}</if><if test='status != null'>,status=#{status}</if> WHERE id=#{id} AND deleted=0</script>")
    int updateById(SysJob job);
    @Update("UPDATE sys_job SET deleted=1,update_time=NOW() WHERE id=#{id}")
    int deleteById(@Param("id") Long id);
}
