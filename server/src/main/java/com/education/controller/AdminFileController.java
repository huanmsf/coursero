package com.education.controller;

import com.education.common.api.Result;
import com.education.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/files")
public class AdminFileController {
    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    public Result<Map<String, String>> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "directory", defaultValue = "common") String directory) {
        String filePath = fileService.uploadFile(file, directory);
        String fileUrl = fileService.getFileUrl(filePath);
        
        Map<String, String> result = new HashMap<>();
        result.put("path", filePath);
        result.put("url", fileUrl);
        return Result.success(result);
    }

    @DeleteMapping
    public Result<Void> deleteFile(@RequestParam String path) {
        fileService.deleteFile(path);
        return Result.success();
    }
} 