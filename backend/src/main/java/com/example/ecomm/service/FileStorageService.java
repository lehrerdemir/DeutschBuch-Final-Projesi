package com.example.ecomm.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    /**
     * Saves the uploaded file and returns a public URL path (e.g., /uploads/abc.jpg).
     */
    public String saveProductImage(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) return null;

        String contentType = file.getContentType() == null ? "" : file.getContentType().toLowerCase();
        if (!contentType.startsWith("image/")) {
            throw new IOException("Only image uploads are allowed.");
        }

        String original = file.getOriginalFilename() == null ? "image" : file.getOriginalFilename();
        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0 && dot < original.length() - 1) {
            ext = original.substring(dot);
        }

        String filename = UUID.randomUUID() + ext;
        Path dir = Path.of(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(dir);
        Path dest = dir.resolve(filename);

        file.transferTo(dest);

        // Public path served by StaticResourceConfig
        return "/uploads/" + filename;
    }
}
