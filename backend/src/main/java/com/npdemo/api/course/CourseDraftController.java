package com.npdemo.api.course;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/course-drafts")
public class CourseDraftController {
    private final CourseDraftService service;

    public CourseDraftController(CourseDraftService service) {
        this.service = service;
    }

    @PostMapping
    ResponseEntity<CourseDraft> create(@Valid @RequestBody CourseDraftRequest.Create request) {
        CourseDraft draft = service.create(request);
        return ResponseEntity.created(URI.create("/api/admin/course-drafts/" + draft.id())).body(draft);
    }

    @GetMapping
    List<CourseDraft> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    CourseDraft get(@PathVariable UUID id) {
        return service.get(id);
    }

    @PutMapping("/{id}")
    CourseDraft update(@PathVariable UUID id, @Valid @RequestBody CourseDraftRequest.Update request) {
        return service.update(id, request);
    }
}
