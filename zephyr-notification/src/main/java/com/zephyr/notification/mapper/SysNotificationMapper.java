package com.zephyr.notification.mapper;

import com.zephyr.notification.domain.SysNotification;
import org.apache.ibatis.annotations.*;
import java.util.List;

@Mapper
public interface SysNotificationMapper {
    @Select("SELECT * FROM sys_notification WHERE receiver_id = #{receiverId} AND deleted = 0 ORDER BY create_time DESC")
    List<SysNotification> selectByReceiverId(@Param("receiverId") Long receiverId);
    @Insert("INSERT INTO sys_notification(title,content,type,sender_id,receiver_id,status,create_time,deleted) VALUES(#{title},#{content},#{type},#{senderId},#{receiverId},#{status},NOW(),0)")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    int insert(SysNotification notif);
    @Update("UPDATE sys_notification SET status='1',read_time=NOW() WHERE id=#{id}")
    int markAsRead(@Param("id") Long id);
    @Update("UPDATE sys_notification SET deleted=1 WHERE id=#{id}")
    int deleteById(@Param("id") Long id);
}
