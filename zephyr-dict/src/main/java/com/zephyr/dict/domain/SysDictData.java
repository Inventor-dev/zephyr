package com.zephyr.dict.domain;

import lombok.Data;
import java.io.Serializable;

@Data
public class SysDictData implements Serializable {
    private Long id;
    private Long dictTypeId;
    private String dictType;
    private String dictLabel;
    private String dictValue;
    private Integer dictSort;
    private String status;
    private String remark;
    private Integer deleted;
}
