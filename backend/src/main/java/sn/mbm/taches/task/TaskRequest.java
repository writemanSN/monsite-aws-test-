package sn.mbm.taches.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record TaskRequest(
    @NotBlank(message = "Le titre est obligatoire")
    @Size(max = 180, message = "Le titre ne doit pas dépasser 180 caractères")
    String title
) {}
