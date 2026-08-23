package com.npdemo.api.course;

import java.time.Instant;
import java.util.UUID;

public record CourseDraft(
        UUID id,
        String code,
        String name,
        String description,
        String coverUrl,
        String learningRequirements,
        String status,
        String createdBy,
        long version,
        Instant createdAt,
        Instant updatedAt) {}
