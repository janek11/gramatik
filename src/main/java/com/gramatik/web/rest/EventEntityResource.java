package com.gramatik.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.gramatik.domain.EventEntity;

import com.gramatik.repository.EventEntityRepository;
import com.gramatik.web.rest.errors.BadRequestAlertException;
import com.gramatik.web.rest.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing EventEntity.
 */
@RestController
@RequestMapping("/api")
public class EventEntityResource {

    private final Logger log = LoggerFactory.getLogger(EventEntityResource.class);

    private static final String ENTITY_NAME = "eventEntity";

    private final EventEntityRepository eventEntityRepository;

    public EventEntityResource(EventEntityRepository eventEntityRepository) {
        this.eventEntityRepository = eventEntityRepository;
    }

    /**
     * POST  /event-entities : Create a new eventEntity.
     *
     * @param eventEntity the eventEntity to create
     * @return the ResponseEntity with status 201 (Created) and with body the new eventEntity, or with status 400 (Bad Request) if the eventEntity has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/event-entities")
    @Timed
    public ResponseEntity<EventEntity> createEventEntity(@Valid @RequestBody EventEntity eventEntity) throws URISyntaxException {
        log.debug("REST request to save EventEntity : {}", eventEntity);
        if (eventEntity.getId() != null) {
            throw new BadRequestAlertException("A new eventEntity cannot already have an ID", ENTITY_NAME, "idexists");
        }
        EventEntity result = eventEntityRepository.save(eventEntity);
        return ResponseEntity.created(new URI("/api/event-entities/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /event-entities : Updates an existing eventEntity.
     *
     * @param eventEntity the eventEntity to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated eventEntity,
     * or with status 400 (Bad Request) if the eventEntity is not valid,
     * or with status 500 (Internal Server Error) if the eventEntity couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/event-entities")
    @Timed
    public ResponseEntity<EventEntity> updateEventEntity(@Valid @RequestBody EventEntity eventEntity) throws URISyntaxException {
        log.debug("REST request to update EventEntity : {}", eventEntity);
        if (eventEntity.getId() == null) {
            return createEventEntity(eventEntity);
        }
        EventEntity result = eventEntityRepository.save(eventEntity);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, eventEntity.getId().toString()))
            .body(result);
    }

    /**
     * GET  /event-entities : get all the eventEntities.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of eventEntities in body
     */
    @GetMapping("/event-entities")
    @Timed
    public List<EventEntity> getAllEventEntities() {
        log.debug("REST request to get all EventEntities");
        //TODO zmiana as
        return eventEntityRepository.findByUserIsCurrentUser();
        }

    /**
     * GET  /event-entities/:id : get the "id" eventEntity.
     *
     * @param id the id of the eventEntity to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the eventEntity, or with status 404 (Not Found)
     */
    @GetMapping("/event-entities/{id}")
    @Timed
    public ResponseEntity<EventEntity> getEventEntity(@PathVariable Long id) {
        log.debug("REST request to get EventEntity : {}", id);
        EventEntity eventEntity = eventEntityRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(eventEntity));
    }

    /**
     * DELETE  /event-entities/:id : delete the "id" eventEntity.
     *
     * @param id the id of the eventEntity to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/event-entities/{id}")
    @Timed
    public ResponseEntity<Void> deleteEventEntity(@PathVariable Long id) {
        log.debug("REST request to delete EventEntity : {}", id);
        eventEntityRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
