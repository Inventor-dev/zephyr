package xyz.lemone.zephyr.common.core.domain;

import lombok.Data;
import java.io.Serializable;
import java.util.Collections;
import java.util.List;

/**
 * 分页响应
 */
@Data
public class PageResult<T> implements Serializable {

    private List<T> list;
    private long total;
    private int page;
    private int pageSize;

    public static <T> PageResult<T> of(List<T> list, long total, int page, int pageSize) {
        PageResult<T> result = new PageResult<>();
        result.setList(list);
        result.setTotal(total);
        result.setPage(page);
        result.setPageSize(pageSize);
        return result;
    }

    public static <T> PageResult<T> empty() {
        return of(Collections.emptyList(), 0, 1, 20);
    }
}
