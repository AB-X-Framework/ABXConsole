package org.abx.service.creds;


import org.abx.service.creds.dao.PermissionRepository;
import org.abx.service.creds.dao.RoleRepository;
import org.abx.service.creds.dao.UserRepository;
import org.abx.service.creds.model.Permission;
import org.abx.service.creds.model.Role;
import org.abx.service.creds.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

@Component
public class SetupDataLoader implements ApplicationListener<ContextRefreshedEvent> {

    private boolean alreadySetup = false;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // API

    @Override
    @Transactional
    public void onApplicationEvent(final ContextRefreshedEvent event) {
        if (alreadySetup) {
            return;
        }

        // == create initial privileges
        final Permission readPermission = createPermissionIfNotFound("READ");
        final Permission writePermission = createPermissionIfNotFound("WRITE");
        final Permission passwordPermission = createPermissionIfNotFound("CHANGE_PASSWORD_PRIVILEGE");

        // == create initial roles
        final List<Permission> adminPermissions = new ArrayList<>(Arrays.asList(readPermission, writePermission, passwordPermission));
        final List<Permission> userPermissions = new ArrayList<>(Arrays.asList(readPermission, passwordPermission));
        final Role adminRole = createRoleIfNotFound("ROLE_ADMIN", adminPermissions);
        createRoleIfNotFound("ROLE_USER", userPermissions);

        // == create initial user
        createUserIfNotFound("test@test.com", "Test",  new ArrayList<>(Arrays.asList(adminRole)));

        alreadySetup = true;
    }

    @Transactional
    public Permission createPermissionIfNotFound(final String name) {
        Permission permission = permissionRepository.findByName(name);
        if (permission == null) {
            permission = new Permission(name);
            permission = permissionRepository.save(permission);
        }
        return permission;
    }

    @Transactional
    public Role createRoleIfNotFound(final String name, final Collection<Permission> permissions) {
        Role role = roleRepository.findByName(name);
        if (role == null) {
            role = new Role(name);
        }
        role.setPermissions(permissions);
        role = roleRepository.save(role);
        return role;
    }

    @Transactional
    public User createUserIfNotFound(final String username, final String password, final Collection<Role> roles) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
        }
        user.setRoles(roles);
        user = userRepository.save(user);
        return user;
    }

}