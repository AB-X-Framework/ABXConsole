package org.abx.console.persistence.dao;

import org.abx.console.persistence.model.UserDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDetailsRepository extends JpaRepository<UserDetail, Long> {

    UserDetail findByName(String name);

    @Override
    void delete(UserDetail userDetail);

}
