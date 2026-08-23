package com.npdemo.api.course;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest
class CourseDraftApiTest {
    @Autowired private WebApplicationContext context;
    @Autowired private JdbcTemplate jdbc;
    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        jdbc.update("DELETE FROM course_drafts");
        mockMvc = MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    void createsQueriesAndUpdatesDraftWithPersistenceReadback() throws Exception {
        String createdJson = mockMvc.perform(post("/api/admin/course-drafts")
                        .contentType("application/json")
                        .content("""
                                {"code":" CRS-101 ","name":"Safety basics","description":"Initial draft",
                                 "learningRequirements":"Complete all materials"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", org.hamcrest.Matchers.matchesPattern("/api/admin/course-drafts/.+")))
                .andExpect(jsonPath("$.status").value("DRAFT"))
                .andExpect(jsonPath("$.createdBy").value("training-admin"))
                .andExpect(jsonPath("$.version").value(0))
                .andReturn().getResponse().getContentAsString();

        UUID id = UUID.fromString(JsonPath.read(createdJson, "$.id"));
        assertThat(jdbc.queryForObject("SELECT code FROM course_drafts WHERE id = ?", String.class, id))
                .isEqualTo("CRS-101");

        mockMvc.perform(get("/api/admin/course-drafts/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Safety basics"));
        mockMvc.perform(get("/api/admin/course-drafts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(id.toString()));

        mockMvc.perform(put("/api/admin/course-drafts/{id}", id)
                        .contentType("application/json")
                        .content("{\"code\":\"CRS-101\",\"name\":\"Updated safety basics\",\"version\":0}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated safety basics"))
                .andExpect(jsonPath("$.version").value(1));

        assertThat(jdbc.queryForMap("SELECT name, version, status FROM course_drafts WHERE id = ?", id))
                .containsEntry("name", "Updated safety basics")
                .containsEntry("version", 1L)
                .containsEntry("status", "DRAFT");
    }

    @Test
    void rejectsMissingRequiredFieldsAndDuplicateCode() throws Exception {
        mockMvc.perform(post("/api/admin/course-drafts")
                        .contentType("application/json").content("{\"code\":\"  \",\"name\":\"\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"))
                .andExpect(jsonPath("$.fields.code").exists())
                .andExpect(jsonPath("$.fields.name").exists());

        create("CRS-UNIQUE", "First");
        mockMvc.perform(post("/api/admin/course-drafts")
                        .contentType("application/json")
                        .content("{\"code\":\"CRS-UNIQUE\",\"name\":\"Second\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("COURSE_CODE_ALREADY_EXISTS"));
    }

    @Test
    void returnsUnifiedErrorsForMalformedBodyAndInvalidDraftId() throws Exception {
        mockMvc.perform(post("/api/admin/course-drafts")
                        .contentType("application/json").content("{not-json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("INVALID_REQUEST_BODY"))
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.fields").isMap())
                .andExpect(jsonPath("$.timestamp").exists());

        mockMvc.perform(get("/api/admin/course-drafts/not-a-uuid"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("INVALID_REQUEST_PARAMETER"))
                .andExpect(jsonPath("$.fields.id").value("has an invalid value"));
    }

    @Test
    void rejectsStaleVersionWithoutOverwritingPersistedDraft() throws Exception {
        UUID id = create("CRS-LOCK", "Original");
        String update = "{\"code\":\"CRS-LOCK\",\"name\":\"Current\",\"version\":0}";
        mockMvc.perform(put("/api/admin/course-drafts/{id}", id).contentType("application/json").content(update))
                .andExpect(status().isOk());

        mockMvc.perform(put("/api/admin/course-drafts/{id}", id)
                        .contentType("application/json")
                        .content("{\"code\":\"CRS-LOCK\",\"name\":\"Stale overwrite\",\"version\":0}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value("COURSE_DRAFT_VERSION_CONFLICT"));

        assertThat(jdbc.queryForObject("SELECT name FROM course_drafts WHERE id = ?", String.class, id))
                .isEqualTo("Current");
    }

    private UUID create(String code, String name) throws Exception {
        String response = mockMvc.perform(post("/api/admin/course-drafts")
                        .contentType("application/json")
                        .content("{\"code\":\"" + code + "\",\"name\":\"" + name + "\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        return UUID.fromString(JsonPath.read(response, "$.id"));
    }
}
