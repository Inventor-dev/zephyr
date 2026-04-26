package com.zephyr.codegen.domain;

import lombok.Data;
import java.io.Serializable;

@Data
public class GenTable implements Serializable {
    private Long id;
    private String tableName;
    private String tableComment;
    private String className;
    private String templateType;
    private String packageName;
    private String moduleCode;
    private String author;
    private Integer genFlag;
}
