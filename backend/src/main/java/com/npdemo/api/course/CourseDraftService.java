package com.npdemo.api.course;

import com.npdemo.api.error.ApiException;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CourseDraftService {
    static final String TRAINING_ADMIN = "training-admin";

    private final CourseDraftRepository repository;

    CourseDraftService(CourseDraftRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public CourseDraft create(CourseDraftRequest.Create request) {
        try {
            return repository.insert(UUID.randomUUID(), request, TRAINING_ADMIN, Instant.now());
        } catch (DataIntegrityViolationException exception) {
            throw duplicateCode();
        }
    }

    @Transactional(readOnly = true)
    public CourseDraft get(UUID id) {
        return repository.find(id).orElseThrow(() -> new ApiException(
                HttpStatus.NOT_FOUND, "COURSE_DRAFT_NOT_FOUND", "Course draft was not found"));
    }

    @Transactional(readOnly = true)
    public List<CourseDraft> list() {
        return repository.findAll();
    }

    @Transactional
    public CourseDraft update(UUID id, CourseDraftRequest.Update request) {
        try {
            if (!repository.update(id, request, Instant.now())) {
                if (repository.find(id).isEmpty()) {
                    throw new ApiException(HttpStatus.NOT_FOUND, "COURSE_DRAFT_NOT_FOUND", "Course draft was not found");
                }
                throw new ApiException(HttpStatus.CONFLICT, "COURSE_DRAFT_VERSION_CONFLICT",
                        "Course draft has been updated; reload it before saving");
            }
            return repository.find(id).orElseThrow();
        } catch (DataIntegrityViolationException exception) {
            throw duplicateCode();
        }
    }

    private ApiException duplicateCode() {
        return new ApiException(HttpStatus.CONFLICT, "COURSE_CODE_ALREADY_EXISTS", "Course code already exists");
    }
}
