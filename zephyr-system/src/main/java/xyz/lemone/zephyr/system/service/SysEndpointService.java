package xyz.lemone.zephyr.system.service;

import xyz.lemone.zephyr.system.domain.SysEndpoint;
import java.util.List;

public interface SysEndpointService {
    SysEndpoint selectById(Long id);
    SysEndpoint selectByAppCode(String appCode);
    List<SysEndpoint> selectAll();
    SysEndpoint create(SysEndpoint endpoint);
    boolean update(SysEndpoint endpoint);
    boolean delete(Long id);
}
