package xyz.lemone.zephyr.notification.service;

import xyz.lemone.zephyr.notification.domain.SysNotification;
import java.util.List;

public interface SysNotificationService {
    List<SysNotification> selectByReceiverId(Long receiverId);
    SysNotification create(SysNotification notif);
    boolean markAsRead(Long id);
    boolean delete(Long id);
}
