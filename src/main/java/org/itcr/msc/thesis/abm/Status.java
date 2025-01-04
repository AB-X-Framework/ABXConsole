package org.itcr.msc.thesis.abm;

import lombok.Getter;

public class Status {

    @Getter
    private String chartNames;

    @Getter
    private String layerNames;

    @Getter
    private String output;

    @Getter
    private String stepId;

    @Getter
    private boolean testingDone;

    @Getter
    private int success;

    @Getter
    private int scale;

    @Getter
    private int failures;

    public Status() {
    }

    public Status(String output, String statusId, int scale, String chartNames, String layerNames) {
        this.output = output;
        this.stepId = statusId;
        this.scale = scale;
        this.chartNames = chartNames;
        this.layerNames = layerNames;
    }


    public Status(String output, int success, int failures) {
        this.output = output;
        this.testingDone = true;
        this.success = success;
        this.stepId = "Total "+(success+failures)+ ". Success: "+success+". Failures:"+failures;
        this.failures = failures;
    }

}