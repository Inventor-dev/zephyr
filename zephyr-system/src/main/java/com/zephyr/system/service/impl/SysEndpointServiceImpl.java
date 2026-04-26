package com.zephyr.system.service.impl;

import com.zephyr.common.core.exception.BusinessException;
import com.zephyr.system.domain.SysEndpoint;
import com.zephyr.system.mapper.SysEndpointMapper;
import com.zephyr.system.service.SysEndpointService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SysEndpointServiceImpl implements SysEndpointService {

    private final SysEndpointMapper endpointMapper;

    @Override
    public SysEndpoint selectById(Long id) {
        SysEndpoint ep = endpointMapper.selectById(id);
        if (ep == null) throw new BusinessException("ENDPOINT_NOT_FOUND", "端点不存在");
        return ep;
    }

    @Override
    public SysEndpoint selectByAppCode(String appCode) { return endpointMapper.selectByAppCode(appCode); }

    @Override
    public List<SysEndpoint> selectAll() { return endpointMapper.selectAll(); }

    @Override
    @Transactional
    public SysEndpoint create(SysEndpoint endpoint) {
        endpoint.setStatus("1");
        endpoint.setDeleted(0);
        endpointMapper.insert(endpoint);
        return endpoint;
    }

    @Override
    @Transactional
    public boolean update(SysEndpoint endpoint) { return endpointMapper.updateById(endpoint) > 0; }

    @Override
    @Transactional
    public boolean delete(Long id) { return endpointMapper.deleteById(id) > 0; }
}
