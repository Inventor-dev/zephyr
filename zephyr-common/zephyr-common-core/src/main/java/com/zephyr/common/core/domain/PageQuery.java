package com.zephyr.common.core.domain;

import lombok.Data;
import java.io.Serializable;

/**
 * 分页查询基类
 */
@Data
public class PageQuery implements Serializable {

    private int page = 1;
    private int pageSize = 20;
    private String orderBy;
    private boolean asc = true;

    public int getOffset() {
        return (page - 1) * pageSize;
    }
}
