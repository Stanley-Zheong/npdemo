package com.npdemo.api.course;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

@Repository
class CourseDraftRepository {
    private final JdbcClient jdbc;

    CourseDraftRepository(JdbcClient jdbc) {
        this.jdbc = jdbc;
    }

    CourseDraft insert(UUID id, CourseDraftRequest.Create request, String actor, Instant now) {
        jdbc.sql("""
                INSERT INTO course_drafts
                    (id, code, name, description, cover_url, learning_requirements, status,
                     created_by, version, created_at, updated_at)
                VALUES (:id, :code, :name, :description, :coverUrl, :requirements, 'DRAFT',
                        :actor, 0, :createdAt, :updatedAt)
                """)
                .param("id", id)
                .param("code", request.code().trim())
                .param("name", request.name().trim())
                .param("description", request.description())
                .param("coverUrl", request.coverUrl())
                .param("requirements", request.learningRequirements())
                .param("actor", actor)
                .param("createdAt", now)
                .param("updatedAt", now)
                .update();
        return find(id).orElseThrow();
    }

    Optional<CourseDraft> find(UUID id) {
        return jdbc.sql("SELECT * FROM course_drafts WHERE id = :id AND status = 'DRAFT'")
                .param("id", id)
                .query(CourseDraftRepository::map)
                .optional();
    }

    List<CourseDraft> findAll() {
        return jdbc.sql("SELECT * FROM course_drafts WHERE status = 'DRAFT' ORDER BY updated_at DESC, id")
                .query(CourseDraftRepository::map)
                .list();
    }

    boolean update(UUID id, CourseDraftRequest.Update request, Instant now) {
        return jdbc.sql("""
                UPDATE course_drafts
                SET code = :code, name = :name, description = :description, cover_url = :coverUrl,
                    learning_requirements = :requirements, version = version + 1, updated_at = :updatedAt
                WHERE id = :id AND status = 'DRAFT' AND version = :version
                """)
                .param("id", id)
                .param("code", request.code().trim())
                .param("name", request.name().trim())
                .param("description", request.description())
                .param("coverUrl", request.coverUrl())
                .param("requirements", request.learningRequirements())
                .param("version", request.version())
                .param("updatedAt", now)
                .update() == 1;
    }

    private static CourseDraft map(ResultSet result, int row) throws SQLException {
        return new CourseDraft(
                result.getObject("id", UUID.class),
                result.getString("code"),
                result.getString("name"),
                result.getString("description"),
                result.getString("cover_url"),
                result.getString("learning_requirements"),
                result.getString("status"),
                result.getString("created_by"),
                result.getLong("version"),
                result.getObject("created_at", java.time.OffsetDateTime.class).toInstant(),
                result.getObject("updated_at", java.time.OffsetDateTime.class).toInstant());
    }
}
