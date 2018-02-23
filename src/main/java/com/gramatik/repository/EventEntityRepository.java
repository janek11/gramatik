package com.gramatik.repository;

import com.gramatik.domain.EventEntity;
import org.springframework.stereotype.Repository;

import org.springframework.data.jpa.repository.*;
import java.util.List;

/**
 * Spring Data JPA repository for the EventEntity entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventEntityRepository extends JpaRepository<EventEntity, Long> {

    @Query("select event_entity from EventEntity event_entity where event_entity.user.login = ?#{principal.username}")
    List<EventEntity> findByUserIsCurrentUser();

}
