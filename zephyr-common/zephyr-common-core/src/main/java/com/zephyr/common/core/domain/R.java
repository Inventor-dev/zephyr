package com.zephyr.common.core.domain;

import lombok.Data;
import java.io.Serializable;

/**
 * 统一响应体（Ant Design Pro 规范）
 */
@Data
public class R<T> implements Serializable {

    private boolean success;
    private T data;
    private String errorCode;
    private String errorMessage;
    private Integer showType;
    private long timestamp;

    public static <T> R<T> ok(T data) {
        R<T> r = new R<>();
        r.setSuccess(true);
        r.setData(data);
        r.setTimestamp(System.currentTimeMillis());
        return r;
    }

    public static <T> R<T> ok() {
        return ok(null);
    }

    public static <T> R<T> fail(String errorMessage) {
        R<T> r = new R<>();
        r.setSuccess(false);
        r.setErrorMessage(errorMessage);
        r.setTimestamp(System.currentTimeMillis());
        return r;
    }

    public static <T> R<T> fail(String errorCode, String errorMessage) {
        R<T> r = new R<>();
        r.setSuccess(false);
        r.setErrorCode(errorCode);
        r.setErrorMessage(errorMessage);
        r.setTimestamp(System.currentTimeMillis());
        return r;
    }

    public static <T> R<T> fail(String errorCode, String errorMessage, Integer showType) {
        R<T> r = new R<>();
        r.setSuccess(false);
        r.setErrorCode(errorCode);
        r.setErrorMessage(errorMessage);
        r.setShowType(showType);
        r.setTimestamp(System.currentTimeMillis());
        return r;
    }
}
