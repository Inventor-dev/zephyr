package xyz.lemone.zephyr.notification.controller;

import xyz.lemone.zephyr.common.core.domain.R;
import xyz.lemone.zephyr.notification.domain.SysNotification;
import xyz.lemone.zephyr.notification.service.SysNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
public class SysNotificationController {
    private final SysNotificationService notifService;

    @GetMapping("/my/{userId}") public R<List<SysNotification>> myNotifs(@PathVariable Long userId) { return R.ok(notifService.selectByReceiverId(userId)); }
    @PostMapping public R<SysNotification> create(@RequestBody SysNotification notif) { return R.ok(notifService.create(notif)); }
    @PostMapping("/{id}/read") public R<Boolean> markAsRead(@PathVariable Long id) { return R.ok(notifService.markAsRead(id)); }
    @DeleteMapping("/{id}") public R<Boolean> delete(@PathVariable Long id) { return R.ok(notifService.delete(id)); }
}
