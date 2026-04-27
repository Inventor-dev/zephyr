package xyz.lemone.zephyr.form.service;

import xyz.lemone.zephyr.form.domain.FormDefinition;
import xyz.lemone.zephyr.form.domain.FormData;
import java.util.List;

public interface FormService {
    List<FormDefinition> selectAllDefinitions();
    FormDefinition selectDefinitionById(Long id);
    FormDefinition createDefinition(FormDefinition def);
    boolean updateDefinition(FormDefinition def);
    boolean deleteDefinition(Long id);
    List<FormData> selectDataByFormDefId(Long formDefId);
    FormData submitData(FormData data);
    boolean updateData(FormData data);
    boolean deleteData(Long id);
}
