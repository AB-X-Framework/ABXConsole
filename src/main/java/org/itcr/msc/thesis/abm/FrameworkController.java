package org.itcr.msc.thesis.abm;

import org.itcr.msc.thesis.abm.syntax.OptimizationLevel;
import org.itcr.msc.thesis.abm.utils.ExceptionHandler;
import org.itcr.msc.thesis.abm.utils.StreamUtils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;

@RestController
@RequestMapping("/framework")
public class FrameworkController implements ABMListener {

    private ABMFrameworkCore core;
    private final StatusController statusController;
    private final FileController fileController;
    private byte[] notFound;
    private Thread liveThread;

    /**
     * @param statusController
     * @param fileController
     */
    @Autowired
    public FrameworkController(StatusController statusController, FileController fileController) {
        this.statusController = statusController;
        this.fileController = fileController;
    }

    /**
     * @param content
     */
    @PostMapping(path = "/simulate")
    public void simulate(@RequestBody String content) {
        try {
            stop();
            liveThread = new Thread() {
                public void run() {
                    try {
                        simulateAux(content);
                    } catch (Exception e) {
                        print(e.getMessage());
                        ExceptionHandler.handleException(e);
                        try {
                            statusController.currStatus("Error during setup.");
                        } catch (Exception e2) {
                            print(e2.getMessage());
                            ExceptionHandler.handleException(e2);
                        }
                    }
                }
            };
            liveThread.start();
        } catch (Exception e) {
            print(e.getMessage());
            ExceptionHandler.handleException(e);
        }
    }

    /**
     * @param content
     * @throws Exception
     */
    public synchronized void simulateAux(String content) throws Exception {
        JSONObject jsonContent = new JSONObject(content);
        String optimizationLevel = jsonContent.getString("optimizationLevel");
        String simulationType = jsonContent.getString("simulationType");
        statusController.addOutput("Running " + simulationType + "\n");
        statusController.addOutput("Optimization level chosen " + optimizationLevel + "\n");
        core = new ABMFrameworkCore(OptimizationLevel.valueOf(optimizationLevel));
        core.addListener(this);
        core.setupReady();
        switch (jsonContent.getString("modelType")) {
            case "example":
                String name = jsonContent.getString("name");
                statusController.addOutput("Model example is " + name + "\n");
                core.process("examples" + jsonContent.getString("path"), jsonContent.getString("model"), name);
                break;
            case "file":
                String filename = jsonContent.getString("model");
                statusController.addOutput("Model file is " + filename + "\n");
                core.processFile(fileController.workingFolder.getName() + "/" + filename);
        }
        switch (simulationType) {
            case "simulation": {
                simulate();
                break;
            }
            case "test": {
                switch (jsonContent.getString("modelType")) {
                    case "example":
                        core.process("examples" + jsonContent.getString("path"), "runTests();", "VM");
                        break;
                    case "file":
                        String filename = jsonContent.getString("model");
                        core.process(fileController.workingFolder.getName() + "/" +
                                filename.substring(0, filename.lastIndexOf("/")), "runTests();", "VM");
                        break;
                }
            }
        }
    }

    /**
     * @param message the error to handle
     */
    @Override
    public void handleError(Throwable message) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PrintStream ps = new PrintStream(baos);
            message.printStackTrace(ps);
            statusController.addOutput(baos.toString());
        } catch (Exception e) {
            ExceptionHandler.handleException(e);
        }
    }

    /**
     * @param message
     */
    @Override
    public void print(String message) {
        try {
            statusController.addOutput(message);
        } catch (Exception e) {
            ExceptionHandler.handleException(e);
        }
    }

    /**
     * @param scale the scale
     */
    @Override
    public void scaleUpdated(int scale) {
        try {
            statusController.setScale(scale);
        } catch (Exception e) {
            ExceptionHandler.handleException(e);
        }
    }

    /**
     * @param stepId the new step
     */
    @Override
    public void currStep(int stepId) {
        try {
            statusController.currStep(stepId);
        } catch (Exception e) {
            ExceptionHandler.handleException(e);
        }
    }

    /**
     *
     */
    @Override
    @GetMapping(path = "/clear")
    public void clear() {
        try {
            statusController.clear();
        } catch (Exception e) {
            ExceptionHandler.handleException(e);
        }
    }

    /**
     * @return
     */
    public synchronized boolean stepOnly() {
        try {
            if (!validEnv()) {
                return false;
            }
            return core.process("stepEnv();", "VM").asBoolean();
        } catch (Exception e) {
            ExceptionHandler.handleException(e);
            return false;
        }
    }

    /**
     * @return
     */
    @GetMapping(path = "/step")
    public synchronized boolean unpauseAndStep() {
        try {
            if (!validEnv()) {
                return false;
            }
            return core.process("getEnv().setPaused(false); stepEnv();", "VM").asBoolean();
        } catch (Exception e) {
            ExceptionHandler.handleException(e);
            try {
                statusController.currStatus("Error during step.");
            } catch (Exception e2) {
                ExceptionHandler.handleException(e2);
            }
            return false;
        }
    }

    /**
     * @throws Exception
     */
    @GetMapping(path = "/stop")
    public void stop() throws Exception {
        if (core != null) {//Clear
            core.teardown();
            statusController.reset();
        }
        try {
            if (liveThread != null) {
                liveThread.interrupt();
            }
        } catch (Exception e) {
            ExceptionHandler.handleException(e);
        }
        core = null;
    }

    /**
     *
     */
    @GetMapping(path = "/pause")
    public synchronized void pause() {
        try {
            core.process("getEnv().setPaused(true);", "VM");
        } catch (Exception e) {
            ExceptionHandler.handleException(e);
        }
    }

    /**
     * @param chartName the chart name
     */
    public void chartAdded(String chartName) {
        try {
            statusController.chartAdded(chartName);
        } catch (Exception e) {
            ExceptionHandler.handleException(e);
        }
    }

    /**
     *
     */
    @GetMapping(path = "/simulate")
    private void simulate() {
        unpauseAndStep();
        liveThread = new Thread(() -> {
            while (stepOnly()) {
                try {
                    Thread.sleep(1);
                } catch (Exception e) {
                    ExceptionHandler.handleException(e);
                    break;
                }
            }
        });
        liveThread.start();
    }

    /**
     * @param content
     * @return
     */
    @PostMapping(path = "/evaluate")
    public synchronized String evaluate(@RequestBody String content) {
        try {
            if (core == null) {
                core = new ABMFrameworkCore(OptimizationLevel.standard);
                core.addListener(this);
            }
            return (core.process(new JSONObject(content).getString("content"), "VM").toString());
        } catch (Exception e) {
            ExceptionHandler.handleException(e);
            return e.getMessage();
        }
    }

    /**
     * @param content
     */
    @PostMapping(path = "/execWhile")
    public synchronized void execWhile(@RequestBody String content) {
        try {
            if (!validEnv()) {
                return;
            }
            core.process("getEnv().setPaused(false);", "ExecWhile");
            liveThread = new Thread(() -> {
                boolean shouldContinue = validEnv() && evaluate(content).equalsIgnoreCase("true");
                while (shouldContinue && stepOnly()) {
                    try {
                        shouldContinue = validEnv() && evaluate(content).equalsIgnoreCase("true");
                        Thread.sleep(1);
                    } catch (Exception e) {
                        ExceptionHandler.handleException(e);
                    }
                }
            });
            liveThread.start();
        } catch (Exception e) {
            ExceptionHandler.handleException(e);
        }
    }

    /**
     * @param success  total test cases successfully executed
     * @param failures total test cases failed
     */
    @Override
    public void testingComplete(int success, int failures) {
        statusController.testingComplete(success, failures);
    }

    /**
     * @return
     */
    private synchronized boolean validEnv() {
        try {
            return core != null && core.process("isEnvSet()", "VM").asBoolean();
        } catch (Throwable e) {
            ExceptionHandler.handleException(e);
            return false;
        }
    }

    /**
     * @return
     */
    @GetMapping(path = "/refresh")
    public boolean refresh() {
        statusController.refresh();
        return true;
    }

    /**
     * @return
     */
    @GetMapping(path = "/size")
    public synchronized String size() {
        try {
            if (validEnv()) {
                return core.process("JSON.stringify(getEnv().getSize())", "VM").toString();
            }
        } catch (Throwable e) {
            ExceptionHandler.handleException(e);
        }
        return "[0,0]";
    }

    /**
     * @param format
     * @param layers
     * @param scale
     * @return
     */
    @GetMapping(path = "/img")
    public synchronized ResponseEntity<byte[]> getImg(@RequestParam("format") String format,
                                                      @RequestParam("layers") String layers,
                                                      @RequestParam("scale") int scale) {
        try {
            final HttpHeaders httpHeaders = new HttpHeaders();
            if (!validEnv()) {
                if (notFound == null) {
                    notFound = StreamUtils.readByteArrayResource("org/itcr/msc/thesis/abm/NotSet.png");
                }
                httpHeaders.setContentType(MediaType.IMAGE_PNG);
                return new ResponseEntity<>(notFound, httpHeaders, HttpStatus.NOT_FOUND);
            }
            if (format.equals("jpg")) {
                httpHeaders.setContentType(MediaType.IMAGE_JPEG);
            } else {
                httpHeaders.setContentType(MediaType.IMAGE_PNG);
            }
            return new ResponseEntity<>(
                    core.process("getEnv().img('" + format + "'," + scale + "," + layers + ")", "Img").as(byte[].class),
                    httpHeaders, HttpStatus.OK);
        } catch (Throwable e) {
            ExceptionHandler.handleException(e);
            return null;
        }
    }

    /**
     * @param name
     * @return
     * @throws Exception
     */
    @GetMapping(path = "/chart")
    public synchronized String getChart(@RequestParam("name") String name) throws Exception {
        if (!validEnv()) {
            return "";
        }
        return core.process("JSON.stringify(getEnv().getChartData('" +
                name.replace("'", "\\'") + "'))+''", "Chart").toString();
    }

    /**
     * The list of drawable has been updated
     *
     * @param layerNames the layers name
     */
    @Override
    public void layersUpdated(String layerNames) {
        statusController.layersUpdated(layerNames);
    }


    /**
     * The simulation status has been updated
     *
     * @param status the new status
     */
    @Override
    public void simulationStatusUpdated(String status) {
        try {
            statusController.currStatus(status);
        } catch (Exception e) {
            ExceptionHandler.handleException(e);
        }
    }
}
