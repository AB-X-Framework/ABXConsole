package org.abx.console.repository;

import org.abx.console.repository.dao.UserDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class RepositoryDataLoader implements ApplicationListener<ContextRefreshedEvent> {

    @Autowired
    private UserDetailsRepository userRepository;

    @Override
    @Transactional(transactionManager = "repositoryTransactionManager")
    public void onApplicationEvent(final ContextRefreshedEvent event) {

    }
}

