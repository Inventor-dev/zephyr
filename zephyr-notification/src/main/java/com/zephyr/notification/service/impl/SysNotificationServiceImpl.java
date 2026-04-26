package com.zephyr.notification.service.impl;

import com.zephyr.notification.domain.SysNotification;
import com.zephyr.notification.mapper.SysNotificationMapper;
import com.zephyr.notification.service.SysNotificationService;
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
