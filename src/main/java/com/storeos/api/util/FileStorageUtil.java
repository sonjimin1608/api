package com.storeos.api.util;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class FileStorageUtil {

    private final String uploadDir = "uploads/verification-images/";

    public FileStorageUtil() {
        // 업로드 디렉토리 생성
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to create upload directory", e);
        }
    }

    /**
     * 파일을 저장하고 저장된 파일의 URL을 반환합니다.
     */
    public String saveFile(MultipartFile file) {
        try {
            // 파일이 비어있는지 확인
            if (file.isEmpty()) {
                throw new RuntimeException("Failed to store empty file");
            }

            // 원본 파일명 가져오기
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null) {
                throw new RuntimeException("Failed to get original filename");
            }

            // 확장자 추출
            String extension = "";
            int lastDotIndex = originalFilename.lastIndexOf('.');
            if (lastDotIndex > 0) {
                extension = originalFilename.substring(lastDotIndex);
            }

            // UUID를 사용하여 고유한 파일명 생성
            String filename = UUID.randomUUID().toString() + extension;

            // 파일 저장 경로
            Path destinationPath = Paths.get(uploadDir + filename);

            // 파일 저장
            Files.copy(file.getInputStream(), destinationPath, StandardCopyOption.REPLACE_EXISTING);

            // 저장된 파일의 URL 반환 (예: /uploads/verification-images/uuid.jpg)
            return "/uploads/verification-images/" + filename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }
    }

    /**
     * 파일을 삭제합니다.
     */
    public void deleteFile(String fileUrl) {
        try {
            if (fileUrl != null && !fileUrl.isEmpty()) {
                // URL에서 파일명 추출 (예: /uploads/verification-images/uuid.jpg -> uuid.jpg)
                String filename = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
                Path filePath = Paths.get(uploadDir + filename);
                Files.deleteIfExists(filePath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file", e);
        }
    }
}
