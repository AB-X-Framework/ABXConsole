package org.itcr.msc.thesis.abm;

import org.itcr.msc.thesis.abm.utils.ExceptionHandler;
import org.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.stereotype.Controller;

@EnableScheduling
@Controller
public class StatusController {
    private final static int InitValue = -1;
    private final static String NoCharts = "[]";
    private final static String Baseline = "[]";
    private int scale;
    private StringBuilder output;
    private int stepId;
    private String status;
    private SimpMessagingTemplate template;
    private String listOfCharts;
    private String listOfLayers;
    private Status lastKnown;

    private String getStatus(){
        if (stepId == -1){
            return status;
        }else {
            return "Current step "+stepId+". "+status;
        }
    }

    @Autowired
    public StatusController(SimpMessagingTemplate template) {
        this.template = template;
        output = new StringBuilder();
        scale = InitValue;
        stepId =InitValue;
        listOfCharts = NoCharts;
        listOfLayers = Baseline;
        status = "No Env";
        lastKnown = new Status(output.toString(), getStatus(), scale, listOfCharts,listOfLayers);
    }


    /**
     * Stream the status
     *
     * @throws Exception
     */
    public void updateStatus() throws Exception {
        lastKnown = new Status(output.toString(), getStatus(), scale, listOfCharts,listOfLayers);
        template.convertAndSend("/topic/status", lastKnown);
    }

    public void setScale(int scale) throws Exception {
        this.scale = scale;
        new Thread(() -> {
            try{
                Thread.sleep(300);
                updateStatus();
            }catch (Exception e){
                ExceptionHandler.handleException(e);
            }
        }).start();

    }

    public void addOutput(String more) throws Exception {
        output.append(more);
        updateStatus();
    }

    public void chartAdded(String chartName) throws Exception {
        listOfCharts= new JSONArray(listOfCharts).put(chartName).toString();
        updateStatus();
    }

    public void layersUpdated(String listOfLayers) {
        this.listOfLayers = listOfLayers;
    }

    /**
     * Streams the status
     *
     * @param success
     * @param failures
     */
    public void testingComplete(int success, int failures) {
        lastKnown = new Status(output.toString(), success, failures);
        template.convertAndSend("/topic/status", lastKnown);
    }

    public void refresh() {
        template.convertAndSend("/topic/status", lastKnown);
    }


    public void reset() throws Exception {
        status = "No Env";
        stepId = InitValue;
        scale = InitValue;
        listOfCharts = NoCharts;
        listOfLayers=Baseline;
        output.setLength(0);
        updateStatus();
    }

    public void currStep(int stepId) throws Exception {
        this.stepId = stepId;
        updateStatus();
    }


    public void currStatus(String status) throws Exception {
        this.status = status;
        updateStatus();
    }

    public void clear() throws Exception {
        output.setLength(0);
        updateStatus();
    }

}