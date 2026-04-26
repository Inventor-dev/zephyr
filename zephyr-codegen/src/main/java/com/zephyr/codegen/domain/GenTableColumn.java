package com.zephyr.codegen.domain;

import lombok.Data;
import java.io.Serializable;

@Data
public class GenTableColumn implements Serializable {
    private Long id;
    private Long tableId;
    private String columnName;
    private String columnComment;
    private String columnType;
    private String javaType;
    private String javaField;
    private Integer isPk;
    private Integer isRequired;
    private Integer isInsert;
    private Integer isEdit;
    private Integer isList;
    private Integer isQuery;
    private String queryType;
    private String htmlType;
}
