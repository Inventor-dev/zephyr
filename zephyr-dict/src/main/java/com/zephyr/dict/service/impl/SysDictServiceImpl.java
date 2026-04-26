package com.zephyr.dict.service.impl;

import com.zephyr.dict.domain.SysDictType;
import com.zephyr.dict.domain.SysDictData;
import com.zephyr.dict.mapper.SysDictTypeMapper;
import com.zephyr.dict.mapper.SysDictDataMapper;
import com.zephyr.dict.service.SysDictService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SysDictServiceImpl implements SysDictService {
    private final SysDictTypeMapper typeMapper;
    private final SysDictDataMapper dataMapper;

    @Override public List<SysDictType> selectAllTypes() { return typeMapper.selectAll(); }
    @Override public List<SysDictData> selectByDictType(String dictType) { return dataMapper.selectByDictType(dictType); }
    @Override @Transactional public SysDictType createType(SysDictType dict) { dict.setStatus("1"); dict.setDeleted(0); typeMapper.insert(dict); return dict; }
    @Override @Transactional public boolean updateType(SysDictType dict) { return typeMapper.updateById(dict) > 0; }
    @Override @Transactional public boolean deleteType(Long id) { return typeMapper.deleteById(id) > 0; }
    @Override @Transactional public SysDictData createData(SysDictData data) { data.setStatus("1"); data.setDeleted(0); dataMapper.insert(data); return data; }
    @Override @Transactional public boolean updateData(SysDictData data) { return dataMapper.updateById(data) > 0; }
    @Override @Transactional public boolean deleteData(Long id) { return dataMapper.deleteById(id) > 0; }
}
