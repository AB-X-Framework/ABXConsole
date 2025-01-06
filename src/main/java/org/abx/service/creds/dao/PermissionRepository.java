package org.abx.service.creds.dao;

import org.abx.service.creds.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {

    Permission findByName(String name);

    @Override
    void delete(Permission permission);

}
