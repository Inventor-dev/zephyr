package xyz.lemone.zephyr.common.redis;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * Redis 工具类
 */
@Component
@RequiredArgsConstructor
public class RedisUtils {

    private final StringRedisTemplate redisTemplate;

    /** 默认过期时间：2小时 */
    private static final long DEFAULT_EXPIRE = 7200;

    public void set(String key, String value) {
        redisTemplate.opsForValue().set(key, value, DEFAULT_EXPIRE, TimeUnit.SECONDS);
    }

    public void set(String key, String value, long expireSeconds) {
        redisTemplate.opsForValue().set(key, value, expireSeconds, TimeUnit.SECONDS);
    }

    public String get(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    public Boolean delete(String key) {
        return redisTemplate.delete(key);
    }

    public Long delete(Collection<String> keys) {
        return redisTemplate.delete(keys);
    }

    public Boolean expire(String key, long expireSeconds) {
        return redisTemplate.expire(key, expireSeconds, TimeUnit.SECONDS);
    }

    public Long getExpire(String key) {
        return redisTemplate.getExpire(key, TimeUnit.SECONDS);
    }

    public Boolean hasKey(String key) {
        return redisTemplate.hasKey(key);
    }

    public Long increment(String key) {
        return redisTemplate.opsForValue().increment(key);
    }

    public Long increment(String key, long delta) {
        return redisTemplate.opsForValue().increment(key, delta);
    }

    public Set<String> keys(String pattern) {
        return redisTemplate.keys(pattern);
    }

    // ========== Set 操作 ==========

    public Long setAdd(String key, String... values) {
        return redisTemplate.opsForSet().add(key, values);
    }

    public Set<String> setMembers(String key) {
        return redisTemplate.opsForSet().members(key);
    }

    public Boolean setIsMember(String key, String value) {
        return redisTemplate.opsForSet().isMember(key, value);
    }

    public Long setSize(String key) {
        return redisTemplate.opsForSet().size(key);
    }

    // ========== Hash 操作 ==========

    public void hashPut(String key, String field, String value) {
        redisTemplate.opsForHash().put(key, field, value);
    }

    public Object hashGet(String key, String field) {
        return redisTemplate.opsForHash().get(key, field);
    }

    public void hashDelete(String key, Object... fields) {
        redisTemplate.opsForHash().delete(key, fields);
    }
}
