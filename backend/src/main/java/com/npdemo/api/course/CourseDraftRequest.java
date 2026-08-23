package com.npdemo.api.course;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public final class CourseDraftRequest {
    private CourseDraftRequest() {}

    public record Create(
            @NotBlank @Size(max = 64) String code,
            @NotBlank @Size(max = 200) String name,
            @Size(max = 10000) String description,
            @Size(max = 1000) String coverUrl,
            @Size(max = 10000) String learningRequirements) {}

    public record Update(
            @NotBlank @Size(max = 64) String code,
            @NotBlank @Size(max = 200) String name,
            @Size(max = 10000) String description,
            @Size(max = 1000) String coverUrl,
            @Size(max = 10000) String learningRequirements,
            @NotNull @PositiveOrZero Long version) {}
}
