package org.itcr.msc.thesis.abm;

import org.itcr.msc.thesis.abm.utils.ExceptionHandler;
import org.itcr.msc.thesis.abm.utils.StreamUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.FileInputStream;

@RestController
@RequestMapping("/utils")
public class UXUtils extends FileUtils{
    private String exampleList;

    private void add(JSONArray examples, String currentPath, File currentFile) {
        String fileName = currentFile.getName();
        if (currentFile.isDirectory()) {
            for (File f : currentFile.listFiles()) {
                add(examples, currentPath + fileName + "/", f);
            }
        } else {
            JSONObject example = new JSONObject();
            examples.put(example);
            example.put("name", currentPath + fileName);
            example.put("value", currentPath + fileName);
        }
    }

    public UXUtils() {
        workingFolder = new File("examples");
        JSONArray examples = new JSONArray();
        try {
            for (File f : workingFolder.listFiles()) {
                add(examples, "", f);
            }
            exampleList = examples.toString();
        } catch (Exception e) {
            ExceptionHandler.handleException(e);
        }
    }

}
