package com.gramatik.domain;


import javax.persistence.*;
import javax.validation.constraints.*;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Objects;

/**
 * A EventEntity.
 */
@Entity
@Table(name = "event_entity")
public class EventEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "creation_date", nullable = false)
    private LocalDate creationDate;

    @ManyToOne
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public EventEntity name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public EventEntity creationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
        return this;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public User getUser() {
        return user;
    }

    public EventEntity user(User user) {
        this.user = user;
        return this;
    }

    public void setUser(User user) {
        this.user = user;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EventEntity eventEntity = (EventEntity) o;
        if (eventEntity.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), eventEntity.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "EventEntity{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", creationDate='" + getCreationDate() + "'" +
            "}";
    }
}
