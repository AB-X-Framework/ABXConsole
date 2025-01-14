package org.abx.console.repository.dao;

import org.abx.console.repository.model.UserDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDetailsRepository extends JpaRepository<UserDetail, Long> {

    UserDetail findByName(String name);

    @Override
    void delete(UserDetail userDetail);

}
