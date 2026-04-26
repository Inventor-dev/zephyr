package com.zephyr.common.core.utils;

import java.util.concurrent.ThreadLocalRandom;

/**
 * ID 生成工具（雪花算法简化版）
 */
public class IdUtils {

    private static long sequence = 0L;
    private static long lastTimestamp = -1L;

    /**
     * 生成唯一 ID
     */
    public static synchronized long nextId() {
        long timestamp = System.currentTimeMillis();
        if (timestamp == lastTimestamp) {
            sequence = (sequence + 1) & 4095;
            if (sequence == 0) {
                timestamp = waitNextMillis(lastTimestamp);
            }
        } else {
            sequence = ThreadLocalRandom.current().nextLong(0, 2048);
        }
        lastTimestamp = timestamp;
        return ((timestamp - 1288834974657L) << 22) | sequence;
    }

    private static long waitNextMillis(long lastTimestamp) {
        long timestamp = System.currentTimeMillis();
        while (timestamp <= lastTimestamp) {
            timestamp = System.currentTimeMillis();
        }
        return timestamp;
    }

    /**
     * 生成短 ID（36进制）
     */
    public static String nextShortId() {
        return Long.toString(nextId(), 36);
    }
}
