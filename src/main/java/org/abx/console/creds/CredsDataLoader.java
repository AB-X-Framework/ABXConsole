package org.abx.console.creds;


import org.abx.console.creds.dao.PermissionRepository;
import org.abx.console.creds.dao.RoleRepository;
import org.abx.console.creds.dao.UserRepository;
import org.abx.console.creds.model.Permission;
import org.abx.console.creds.model.Role;
import org.abx.console.creds.model.User;
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
public class CredsDataLoader implements ApplicationListener<ContextRefreshedEvent> {

    private boolean alreadySetup = false;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    public Permission CreateUser;
    public Permission UseABX;


    public Role Admin;
    public Role User;

    // API

    @Override
    @Transactional
    public void onApplicationEvent(final ContextRefreshedEvent event) {
        if (alreadySetup) {
            return;
        }

        // == create initial privileges
        CreateUser = createPermissionIfNotFound("CreateUser");
        UseABX = createPermissionIfNotFound("UseABX");

        // == create initial roles
        final List<Permission> adminPermissions = new ArrayList<>(Arrays.asList(CreateUser, UseABX));
        final List<Permission> userPermissions = new ArrayList<>(Arrays.asList(UseABX));
        Admin = createRoleIfNotFound("ROLE_ADMIN", adminPermissions);
        User = createRoleIfNotFound("ROLE_USER", userPermissions);

        // == create initial user
        createUserIfNotFound("test@test.com", "Test",  new ArrayList<>(Arrays.asList(Admin)));

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