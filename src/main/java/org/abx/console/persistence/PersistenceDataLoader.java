package org.abx.console.persistence;

import org.abx.console.creds.dao.UserRepository;
import org.abx.console.persistence.dao.UserDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class PersistenceDataLoader implements ApplicationListener<ContextRefreshedEvent> {

    @Autowired
    private UserDetailsRepository userRepository;

    @Override
    @Transactional(transactionManager = "persistenceTransactionManager")
    public void onApplicationEvent(final ContextRefreshedEvent event) {

    }
}

