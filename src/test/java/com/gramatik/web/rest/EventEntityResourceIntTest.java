package com.gramatik.web.rest;

import com.gramatik.GramatikApp;

import com.gramatik.domain.EventEntity;
import com.gramatik.repository.EventEntityRepository;
import com.gramatik.web.rest.errors.ExceptionTranslator;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static com.gramatik.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Test class for the EventEntityResource REST controller.
 *
 * @see EventEntityResource
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = GramatikApp.class)
public class EventEntityResourceIntTest {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_CREATION_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATION_DATE = LocalDate.now(ZoneId.systemDefault());

    @Autowired
    private EventEntityRepository eventEntityRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    private MockMvc restEventEntityMockMvc;

    private EventEntity eventEntity;

    @Before
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final EventEntityResource eventEntityResource = new EventEntityResource(eventEntityRepository);
        this.restEventEntityMockMvc = MockMvcBuilders.standaloneSetup(eventEntityResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static EventEntity createEntity(EntityManager em) {
        EventEntity eventEntity = new EventEntity()
            .name(DEFAULT_NAME)
            .creationDate(DEFAULT_CREATION_DATE);
        return eventEntity;
    }

    @Before
    public void initTest() {
        eventEntity = createEntity(em);
    }

    @Test
    @Transactional
    public void createEventEntity() throws Exception {
        int databaseSizeBeforeCreate = eventEntityRepository.findAll().size();

        // Create the EventEntity
        restEventEntityMockMvc.perform(post("/api/event-entities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEntity)))
            .andExpect(status().isCreated());

        // Validate the EventEntity in the database
        List<EventEntity> eventEntityList = eventEntityRepository.findAll();
        assertThat(eventEntityList).hasSize(databaseSizeBeforeCreate + 1);
        EventEntity testEventEntity = eventEntityList.get(eventEntityList.size() - 1);
        assertThat(testEventEntity.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testEventEntity.getCreationDate()).isEqualTo(DEFAULT_CREATION_DATE);
    }

    @Test
    @Transactional
    public void createEventEntityWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = eventEntityRepository.findAll().size();

        // Create the EventEntity with an existing ID
        eventEntity.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restEventEntityMockMvc.perform(post("/api/event-entities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEntity)))
            .andExpect(status().isBadRequest());

        // Validate the EventEntity in the database
        List<EventEntity> eventEntityList = eventEntityRepository.findAll();
        assertThat(eventEntityList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    public void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventEntityRepository.findAll().size();
        // set the field null
        eventEntity.setName(null);

        // Create the EventEntity, which fails.

        restEventEntityMockMvc.perform(post("/api/event-entities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEntity)))
            .andExpect(status().isBadRequest());

        List<EventEntity> eventEntityList = eventEntityRepository.findAll();
        assertThat(eventEntityList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void checkCreationDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = eventEntityRepository.findAll().size();
        // set the field null
        eventEntity.setCreationDate(null);

        // Create the EventEntity, which fails.

        restEventEntityMockMvc.perform(post("/api/event-entities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEntity)))
            .andExpect(status().isBadRequest());

        List<EventEntity> eventEntityList = eventEntityRepository.findAll();
        assertThat(eventEntityList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllEventEntities() throws Exception {
        // Initialize the database
        eventEntityRepository.saveAndFlush(eventEntity);

        // Get all the eventEntityList
        restEventEntityMockMvc.perform(get("/api/event-entities?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(eventEntity.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME.toString())))
            .andExpect(jsonPath("$.[*].creationDate").value(hasItem(DEFAULT_CREATION_DATE.toString())));
    }

    @Test
    @Transactional
    public void getEventEntity() throws Exception {
        // Initialize the database
        eventEntityRepository.saveAndFlush(eventEntity);

        // Get the eventEntity
        restEventEntityMockMvc.perform(get("/api/event-entities/{id}", eventEntity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_UTF8_VALUE))
            .andExpect(jsonPath("$.id").value(eventEntity.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME.toString()))
            .andExpect(jsonPath("$.creationDate").value(DEFAULT_CREATION_DATE.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingEventEntity() throws Exception {
        // Get the eventEntity
        restEventEntityMockMvc.perform(get("/api/event-entities/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateEventEntity() throws Exception {
        // Initialize the database
        eventEntityRepository.saveAndFlush(eventEntity);
        int databaseSizeBeforeUpdate = eventEntityRepository.findAll().size();

        // Update the eventEntity
        EventEntity updatedEventEntity = eventEntityRepository.findOne(eventEntity.getId());
        // Disconnect from session so that the updates on updatedEventEntity are not directly saved in db
        em.detach(updatedEventEntity);
        updatedEventEntity
            .name(UPDATED_NAME)
            .creationDate(UPDATED_CREATION_DATE);

        restEventEntityMockMvc.perform(put("/api/event-entities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(updatedEventEntity)))
            .andExpect(status().isOk());

        // Validate the EventEntity in the database
        List<EventEntity> eventEntityList = eventEntityRepository.findAll();
        assertThat(eventEntityList).hasSize(databaseSizeBeforeUpdate);
        EventEntity testEventEntity = eventEntityList.get(eventEntityList.size() - 1);
        assertThat(testEventEntity.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testEventEntity.getCreationDate()).isEqualTo(UPDATED_CREATION_DATE);
    }

    @Test
    @Transactional
    public void updateNonExistingEventEntity() throws Exception {
        int databaseSizeBeforeUpdate = eventEntityRepository.findAll().size();

        // Create the EventEntity

        // If the entity doesn't have an ID, it will be created instead of just being updated
        restEventEntityMockMvc.perform(put("/api/event-entities")
            .contentType(TestUtil.APPLICATION_JSON_UTF8)
            .content(TestUtil.convertObjectToJsonBytes(eventEntity)))
            .andExpect(status().isCreated());

        // Validate the EventEntity in the database
        List<EventEntity> eventEntityList = eventEntityRepository.findAll();
        assertThat(eventEntityList).hasSize(databaseSizeBeforeUpdate + 1);
    }

    @Test
    @Transactional
    public void deleteEventEntity() throws Exception {
        // Initialize the database
        eventEntityRepository.saveAndFlush(eventEntity);
        int databaseSizeBeforeDelete = eventEntityRepository.findAll().size();

        // Get the eventEntity
        restEventEntityMockMvc.perform(delete("/api/event-entities/{id}", eventEntity.getId())
            .accept(TestUtil.APPLICATION_JSON_UTF8))
            .andExpect(status().isOk());

        // Validate the database is empty
        List<EventEntity> eventEntityList = eventEntityRepository.findAll();
        assertThat(eventEntityList).hasSize(databaseSizeBeforeDelete - 1);
    }

    @Test
    @Transactional
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(EventEntity.class);
        EventEntity eventEntity1 = new EventEntity();
        eventEntity1.setId(1L);
        EventEntity eventEntity2 = new EventEntity();
        eventEntity2.setId(eventEntity1.getId());
        assertThat(eventEntity1).isEqualTo(eventEntity2);
        eventEntity2.setId(2L);
        assertThat(eventEntity1).isNotEqualTo(eventEntity2);
        eventEntity1.setId(null);
        assertThat(eventEntity1).isNotEqualTo(eventEntity2);
    }
}
