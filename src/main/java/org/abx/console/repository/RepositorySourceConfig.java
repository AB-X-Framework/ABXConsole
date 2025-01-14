package org.abx.console.repository;


import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
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
        basePackages = "org.abx.console.repository.dao",
        entityManagerFactoryRef = "repositoryEntityManagerFactory",
        transactionManagerRef = "repositoryTransactionManager"
)
public class RepositorySourceConfig {

    @Bean(name = "repositoryDataSource")
    @ConfigurationProperties(prefix = "spring.datasource.repository")
    public DataSource dataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "repositoryEntityManagerFactory")
    @ConfigurationProperties(prefix = "spring.datasource.repository.jpa")
    public LocalContainerEntityManagerFactoryBean entityManagerFactory(
            @Qualifier("repositoryEntityManagerFactoryBuilder")  EntityManagerFactoryBuilder builder,
            @Qualifier("repositoryDataSource") DataSource dataSource,
            @Value("${spring.datasource.repository.hbm2ddl.auto}") String ddlAuto) {

        Map<String, Object> properties = new HashMap<>();
        properties.put("hibernate.hbm2ddl.auto", ddlAuto); // Ensures schema update
        return builder
                .dataSource(dataSource)
                .packages("org.abx.console.repository.model") // Your entity package
                .persistenceUnit("repository")
                .properties(properties)
                .build();
    }

    @Primary
    @Bean(name = "repositoryTransactionManager")
    public PlatformTransactionManager transactionManager(
            @Qualifier("repositoryEntityManagerFactory") EntityManagerFactory entityManagerFactory) {
        return new JpaTransactionManager(entityManagerFactory);
    }

    @Bean(name = "repositoryEntityManagerFactoryBuilder")
    public EntityManagerFactoryBuilder entityManagerFactoryBuilder() {
        return new EntityManagerFactoryBuilder(new HibernateJpaVendorAdapter(), new HashMap<>(), null);
    }
}