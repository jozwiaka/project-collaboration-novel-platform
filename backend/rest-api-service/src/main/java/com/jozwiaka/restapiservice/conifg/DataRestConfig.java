package com.jozwiaka.restapiservice.config;

import com.jozwiaka.restapiservice.model.User;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class DataRestConfig implements RepositoryRestConfigurer {

    private final EntityManager entityManager;

    @Autowired
    public DataRestConfig(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] unsupportedActions = {HttpMethod.POST};

        exposeIds(config);

        disableHttpMethods(User.class, config, unsupportedActions);

//        config.setReturnBodyOnCreate(true);
//        config.setReturnBodyOnUpdate(true);
//        config.setDefaultMediaType(MediaType.APPLICATION_JSON);
    }

    private void disableHttpMethods(Class theClass, RepositoryRestConfiguration config, HttpMethod[] unsupportedActions) {
        config.getExposureConfiguration()
                .forDomainType((theClass))
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(unsupportedActions));
    }


    private void exposeIds(RepositoryRestConfiguration config) {
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
        List<Class> entityClasses = new ArrayList<>();
        for (EntityType entityType : entities) {
            entityClasses.add(entityType.getJavaType());
        }

        Class[] domainTypes = entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
