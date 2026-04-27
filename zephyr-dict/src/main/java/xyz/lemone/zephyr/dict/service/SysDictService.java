package xyz.lemone.zephyr.dict.service;

import xyz.lemone.zephyr.dict.domain.SysDictType;
import xyz.lemone.zephyr.dict.domain.SysDictData;
import java.util.List;

public interface SysDictService {
    List<SysDictType> selectAllTypes();
    List<SysDictData> selectByDictType(String dictType);
    SysDictType createType(SysDictType dict);
    boolean updateType(SysDictType dict);
    boolean deleteType(Long id);
    SysDictData createData(SysDictData data);
    boolean updateData(SysDictData data);
    boolean deleteData(Long id);
}
