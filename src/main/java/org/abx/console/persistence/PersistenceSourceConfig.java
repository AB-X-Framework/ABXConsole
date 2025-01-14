package org.abx.console.persistence;


import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = "org.abx.console.persistence.dao",
        entityManagerFactoryRef = "persistenceEntityManagerFactory",
        transactionManagerRef = "persistenceTransactionManager"
)
public class PersistenceSourceConfig {

    @Bean(name = "persistenceDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.abx")
    public DataSource dataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "persistenceEntityManagerFactory")
    @ConfigurationProperties(prefix = "spring.datasource.abx.jpa")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            @Qualifier("persistenceEntityManagerFactoryBuilder")  EntityManagerFactoryBuilder builder,
            @Qualifier("persistenceDataSource") DataSource dataSource,
            @Value("${spring.datasource.abx.hbm2ddl.auto}") String ddlAuto) {

        Map<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", ddlAuto); // Ensures schema update
        return builder
                .dataSource(dataSource)
                .packages("org.abx.console.persistence.model") // Your entity package
                .persistenceUnit("abx")
                .properties(properties)
                .build();
    }

    @Bean(name = "persistenceTransactionManager")
    public PlatformTransactionManager transactionManager(
            @Qualifier("persistenceEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }

    @Bean(name = "persistenceEntityManagerFactoryBuilder")
    public EntityManagerFactoryBuilder entityManagerFactoryBuilder() {
        return new EntityManagerFactoryBuilder(new HibernateJpaVendorAdapter(), new HashMap<>(), null);
    }
}