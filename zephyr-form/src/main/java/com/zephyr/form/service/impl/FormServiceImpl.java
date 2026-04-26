package com.zephyr.form.service.impl;

import com.zephyr.form.domain.FormDefinition;
import com.zephyr.form.domain.FormData;
import com.zephyr.form.mapper.FormDefinitionMapper;
import com.zephyr.form.mapper.FormDataMapper;
import com.zephyr.form.service.FormService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FormServiceImpl implements FormService {
    private final FormDefinitionMapper defMapper;
    private final FormDataMapper dataMapper;

    @Override public List<FormDefinition> selectAllDefinitions() { return defMapper.selectAll(); }
    @Override public FormDefinition selectDefinitionById(Long id) { return defMapper.selectById(id); }
    @Override @Transactional public FormDefinition createDefinition(FormDefinition def) { def.setStatus("1"); def.setDeleted(0); defMapper.insert(def); return def; }
    @Override @Transactional public boolean updateDefinition(FormDefinition def) { return defMapper.updateById(def) > 0; }
    @Override @Transactional public boolean deleteDefinition(Long id) { return defMapper.deleteById(id) > 0; }
    @Override public List<FormData> selectDataByFormDefId(Long formDefId) { return dataMapper.selectByFormDefId(formDefId); }
    @Override @Transactional public FormData submitData(FormData data) { data.setStatus("0"); dataMapper.insert(data); return data; }
    @Override @Transactional public boolean updateData(FormData data) { return dataMapper.updateById(data) > 0; }
    @Override @Transactional public boolean deleteData(Long id) { return dataMapper.deleteById(id) > 0; }
}
