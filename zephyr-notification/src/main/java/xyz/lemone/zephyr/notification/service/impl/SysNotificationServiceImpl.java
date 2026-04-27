package xyz.lemone.zephyr.notification.service.impl;

import xyz.lemone.zephyr.notification.domain.SysNotification;
import xyz.lemone.zephyr.notification.mapper.SysNotificationMapper;
import xyz.lemone.zephyr.notification.service.SysNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SysNotificationServiceImpl implements SysNotificationService {
    private final SysNotificationMapper notifMapper;

    @Override public List<SysNotification> selectByReceiverId(Long receiverId) { return notifMapper.selectByReceiverId(receiverId); }
    @Override @Transactional public SysNotification create(SysNotification notif) { notif.setStatus("0"); notif.setDeleted(0); notifMapper.insert(notif); return notif; }
    @Override @Transactional public boolean markAsRead(Long id) { return notifMapper.markAsRead(id) > 0; }
    @Override @Transactional public boolean delete(Long id) { return notifMapper.deleteById(id) > 0; }
}
