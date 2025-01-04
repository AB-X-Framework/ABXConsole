package org.itcr.msc.thesis.abm;

import org.itcr.msc.thesis.abm.utils.ExceptionHandler;
import org.itcr.msc.thesis.abm.utils.StreamUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.File;
import java.io.FileInputStream;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;

public class FileUtils {
    public File workingFolder;
    protected final HashMap<Integer, String> files;

    public FileUtils() {
        files = new HashMap<>();
    }

    protected JSONObject getData(File file, String path, boolean inner) {
        JSONObject jsonObject = new JSONObject();
        String name = file.getName();
        jsonObject.put("name", name);
        jsonObject.put("path", path);
        int id = path.hashCode();
        files.put(id, path);
        jsonObject.put("id", id);
        if (file.isFile()) {
            long size = Math.max(1, file.length() / 1024);
            jsonObject.put("size", size + " KB");
            jsonObject.put("type", "file");
            jsonObject.put("closed", true);
        } else if (file.isDirectory()) {
            jsonObject.put("type", "folder");
            jsonObject.put("size", "");
            if (inner) {
                JSONArray children = new JSONArray();
                jsonObject.put("children", children);

                File[] files = file.listFiles();
                Arrays.sort(files, (f1, f2) -> {
                    if (f1.isDirectory() && f2.isFile()) {
                        return -1;
                    } else if (f1.isFile() && f2.isDirectory()) {
                        return 1;
                    }
                    return f1.getName().compareTo(f2.getName());
                });
                for (int i = 0; i < files.length; ++i) {
                    children.put(getData(files[i], path + "/" + files[i].getName(), false));
                }
                if (files.length == 0) {
                    jsonObject.put("state", "closed");
                }
            } else {
                jsonObject.put("state", "closed");
            }
        }
        return jsonObject;
    }

    @GetMapping(path = "/getFile")
    public String getFile(@RequestParam("path") String path) throws Exception {
        return StreamUtils.readStream(new FileInputStream(new File(workingFolder, path)));
    }

    @GetMapping(path = "/details", produces = "application/json")
    public String details(@RequestParam(name = "id", required = false) String id) throws Exception {
        try {
            if (id == null) {
                JSONArray data = getData(workingFolder, "", true).getJSONArray("children");
                return data.toString(1);
            } else {
                String path = files.get(Integer.parseInt(id));
                return getData(new File(workingFolder, path), path, true).getJSONArray("children").toString(0);
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e);
            return e.getMessage();
        }
    }
}
