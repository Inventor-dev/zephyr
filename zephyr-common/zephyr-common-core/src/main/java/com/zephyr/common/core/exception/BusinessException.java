package com.zephyr.common.core.exception;

import lombok.Getter;

/**
 * 业务异常
 */
@Getter
public class BusinessException extends RuntimeException {

    private final String errorCode;
    private final Integer showType;

    public BusinessException(String message) {
        super(message);
        this.errorCode = "BUSINESS_ERROR";
        this.showType = 2;
    }

    public BusinessException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
        this.showType = 2;
    }

    public BusinessException(String errorCode, String message, Integer showType) {
        super(message);
        this.errorCode = errorCode;
        this.showType = showType;
    }
}
