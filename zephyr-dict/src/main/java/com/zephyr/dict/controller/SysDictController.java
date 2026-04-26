package com.zephyr.dict.controller;

import com.zephyr.common.core.domain.R;
import com.zephyr.dict.domain.SysDictType;
import com.zephyr.dict.domain.SysDictData;
import com.zephyr.dict.service.SysDictService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/dict")
@RequiredArgsConstructor
public class SysDictController {
    private final SysDictService dictService;

    @GetMapping("/type/list") public R<List<SysDictType>> typeList() { return R.ok(dictService.selectAllTypes()); }
    @GetMapping("/data/{dictType}") public R<List<SysDictData>> dataList(@PathVariable String dictType) { return R.ok(dictService.selectByDictType(dictType)); }
    @PostMapping("/type") public R<SysDictType> createType(@RequestBody SysDictType dict) { return R.ok(dictService.createType(dict)); }
    @PutMapping("/type") public R<Boolean> updateType(@RequestBody SysDictType dict) { return R.ok(dictService.updateType(dict)); }
    @DeleteMapping("/type/{id}") public R<Boolean> deleteType(@PathVariable Long id) { return R.ok(dictService.deleteType(id)); }
    @PostMapping("/data") public R<SysDictData> createData(@RequestBody SysDictData data) { return R.ok(dictService.createData(data)); }
    @PutMapping("/data") public R<Boolean> updateData(@RequestBody SysDictData data) { return R.ok(dictService.updateData(data)); }
    @DeleteMapping("/data/{id}") public R<Boolean> deleteData(@PathVariable Long id) { return R.ok(dictService.deleteData(id)); }
}
