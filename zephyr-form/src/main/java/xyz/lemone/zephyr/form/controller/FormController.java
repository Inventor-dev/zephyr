package xyz.lemone.zephyr.form.controller;

import xyz.lemone.zephyr.common.core.domain.R;
import xyz.lemone.zephyr.form.domain.FormDefinition;
import xyz.lemone.zephyr.form.domain.FormData;
import xyz.lemone.zephyr.form.service.FormService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/form")
@RequiredArgsConstructor
public class FormController {
    private final FormService formService;

    @GetMapping("/def/list") public R<List<FormDefinition>> defList() { return R.ok(formService.selectAllDefinitions()); }
    @GetMapping("/def/{id}") public R<FormDefinition> defById(@PathVariable Long id) { return R.ok(formService.selectDefinitionById(id)); }
    @PostMapping("/def") public R<FormDefinition> createDef(@RequestBody FormDefinition def) { return R.ok(formService.createDefinition(def)); }
    @PutMapping("/def") public R<Boolean> updateDef(@RequestBody FormDefinition def) { return R.ok(formService.updateDefinition(def)); }
    @DeleteMapping("/def/{id}") public R<Boolean> deleteDef(@PathVariable Long id) { return R.ok(formService.deleteDefinition(id)); }
    @GetMapping("/data/{formDefId}") public R<List<FormData>> dataList(@PathVariable Long formDefId) { return R.ok(formService.selectDataByFormDefId(formDefId)); }
    @PostMapping("/data") public R<FormData> submitData(@RequestBody FormData data) { return R.ok(formService.submitData(data)); }
    @PutMapping("/data") public R<Boolean> updateData(@RequestBody FormData data) { return R.ok(formService.updateData(data)); }
    @DeleteMapping("/data/{id}") public R<Boolean> deleteData(@PathVariable Long id) { return R.ok(formService.deleteData(id)); }
}
