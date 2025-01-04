package org.itcr.msc.thesis.abm;

import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileOutputStream;

@RestController
@RequestMapping("/file")
public class FileController extends FileUtils{

    public FileController() {
        workingFolder = new File("modelData");
    }

    @PostMapping(path = "/saveFile")
    public int saveFile(@RequestBody String content,
                         @RequestParam("path") String path) throws Exception {
        File workingFile = new File(workingFolder, path);
        FileOutputStream fis = new FileOutputStream(workingFile);
        fis.write(new JSONObject(content).getString("data").
                getBytes("UTF-8"));
        fis.close();
        int id = path.hashCode();
        files.put(id, path);
        return id;
    }

    @GetMapping(path = "/createFile")
    public void createFile(@RequestBody String content,
                           @RequestParam("path") String path) throws Exception {
        File workingFile = new File(workingFolder, path);
        new FileOutputStream(workingFile).close();
    }

    @GetMapping(path = "/renameFile")
    public void rename(@RequestParam("original") String original,@RequestParam("newPath") String newPath){
        new File(workingFolder, original).renameTo(new File(workingFolder,newPath));
    }

    private void deleteFile(File file) {
        if (file.exists()) {
            if (file.isFile()) {
                file.delete();
            } else {
                for (File innerFile : file.listFiles()) {
                    deleteFile(innerFile);
                }
                file.delete();
            }
        }
    }

    @GetMapping(path = "/mkdir")
    public int mkdir(@RequestParam("path") String path) {
        File workingFile = new File(workingFolder, path);
        workingFile.mkdir();
        int id = path.hashCode();
        files.put(id, path);
        return id;
    }

    @GetMapping(path = "/deleteFile")
    public void deleteFile(@RequestParam("path") String path) {
        File workingFile = new File(workingFolder, path);
        deleteFile(workingFile);
    }




}
