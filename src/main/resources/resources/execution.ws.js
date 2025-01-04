var xx;
$(document).ready(function () {
    xx = this;
    var workingChart = null;
    let scale = this.scale = -1;
    let testsChart = null;
    let chartNames = "";
    let selectedChart = null;
    let workingChartData = null;
    let drawing = false;
    let charting = false;
    let layerList = [];

    const stompClient = new StompJs.Client({
        brokerURL: `ws://${location.host}/websocket`
    });

    let refreshCanvasParent = function (next) {
        $("#canvasParent").html(`<canvas id="display"></canvas>`);
        if (typeof next === "function") {
            next();
        }
    }

    let drawImg = function () {
        if (drawing) {
            return;
        }
        drawing = true;
        const img = new Image();
        img.onload = function () {
            $("#display")[0].getContext('2d').drawImage(img, 0, 0);
            drawing = false;
        };
        const imgType = $("#jpeg").switchbutton("options").checked ? "jpeg" : "png";
        const selectedLayers = [];
        for (const layer of layerList) {
            if ($(`#layer${layer}`).switchbutton("options").checked) {
                selectedLayers.push(layer);
            }
        }
        img.src = `framework/img?format=${imgType}&scale=${scale}&layers=${encodeURIComponent(JSON.stringify(selectedLayers))}&_=${Date.now()}`;
    };

    let processTests = function (status) {
        $("#mainTabs").tabs("select", 1);

        if (testsChart != null) {
            testsChart.destroy();
        }
        refreshCanvasParent(() => {
            testsChart = new Chart(document.getElementById('display'), {
                type: 'bar', data: {
                    labels: ['Tests executed'], datasets: [{
                        label: 'Success', data: [status.success], borderWidth: 1
                    }, {
                        label: 'Failures', data: [status.failures], borderWidth: 1
                    }]
                }, options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        });
    };

    let updateGraph = function (value) {
        if (charting) {
            return;
        }
        charting = true;
        $.getJSON("framework/chart?name=" + encodeURIComponent(value), (chartData) => {
            if (workingChart == null || workingChartData.type !== chartData.type
                || workingChartData.options !== chartData.options
                || workingChartData.title !== value) {
                if (workingChart !== null) {
                    workingChart.destroy();
                }
                const ctx = document.getElementById('CurrChart');
                workingChart = new Chart(ctx, chartData);
                workingChartData = {
                    "type": chartData.type, "options": chartData.options,
                    "title": value
                }
            } else {
                workingChart.data = chartData.data;
                workingChart.update();
            }
        }).always(function () {
            charting = false;
        });
    }

    let processUpdate = function (status) {
        if (testsChart != null) {
            testsChart.destroy();
            testsChart = null;
            scale = -1;
            //Model not set
        }
        if ($("#ui").switchbutton("options").checked) {
            const newScale = status.scale;
            if (newScale === -1) {
                refreshCanvasParent();
                scale = newScale;
            } else {
                if (newScale !== scale) {
                    refreshCanvasParent(() => $.getJSON("framework/size", (size) => {
                        $("#display").attr("width", size[0] * newScale).attr("height", size[1] * newScale);
                        scale = newScale;
                        drawImg();
                    }));
                } else {
                    drawImg();
                }
            }
        }
        if ($("#charts").switchbutton("options").checked) {
            const charts = JSON.parse(status.chartNames);
            if (chartNames !== status.chartNames) {
                chartNames = status.chartNames;
                let chartData = "";
                let chartComboData = [];
                let first = true;
                for (const chartName of charts) {
                    chartData += `<option value="${chartName}">${chartName}</option>`;
                    if (first) {
                        chartComboData.push({"text": chartName, "value": chartName, "selected": true});
                        selectedChart = chartName;
                        first = false;
                    } else {
                        chartComboData.push({"text": chartName, "value": chartName})
                    }
                }
                $("#ChartsSelector").html(chartData);
                $("#ChartsSelector").combobox({
                    "data": chartComboData,
                    "onSelect": (seleted) => {
                        updateGraph(seleted.value);
                        selectedChart = seleted.value;
                    }
                });
                if (charts.length === 0 && workingChart !== null) {
                    workingChart.destroy();
                    workingChart = null;
                }
            } else if (charts.length > 0) {
                if (charts.lastIndexOf(selectedChart) === -1) {
                    selectedChart = charts[0]
                }
                updateGraph(selectedChart);
            }
        }
    }
    const equalsCheck = (a, b) =>
        a.length === b.length &&
        a.every((v, i) => v === b[i]);

    stompClient.onConnect = (frame) => {
        stompClient.subscribe('/topic/status', (greeting) => {
            const status = JSON.parse(greeting.body);
            $("#stepId").html(status.stepId);
            const text = document.createTextNode(status.output).wholeText.
            replaceAll(" ","&nbsp;").
            replaceAll("\n", "<br/>");

            $("#output").html(text + "");
            if (status.testingDone) {
                processTests(status);
            } else {
                const newLayers = JSON.parse(status.layerNames);
                if (!equalsCheck(layerList, newLayers)) {
                    layerList = newLayers;
                    $('#layers').html("");
                    for (const layer of layerList) {
                        var switchButtonHtml =
                            `<input class="easyui-switchbutton" checked label="${layer}" id="layer${layer}" ><br/>`;
                        $('#layers').append(switchButtonHtml);
                    }
                    $.parser.parse('#layers');
                }
                processUpdate(status);
            }
        });
        setTimeout(() => $.get("framework/refresh"));
    };

    stompClient.onWebSocketError = (error) => {
        console.error('Error with websocket', error);
    };

    stompClient.onStompError = (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
    };
    stompClient.activate();
});


