var linesPlugin = {
    id: 'linesPlugin',
    beforeDatasetsDraw: function (chart) {
        const xScale = chart.scales['x'];
        const yScale = chart.scales['y'];

        if (chart.data.lines !== undefined) {
            for (const line of chart.data.lines) {
                const ctx = chart.ctx;
                let [xInit, yInit, xEnd, yEnd] = line.coords;
                // Draw the line¡

                const yDelta = yScale.top - yScale.bottom;
                xInit = xScale._startPixel +  xScale.width * xInit;
                xEnd = xScale._startPixel + xScale.width * xEnd;
                yInit = yScale.bottom + yInit * yDelta;
                yEnd = yScale.bottom + yEnd * yDelta;

                ctx.beginPath();
                ctx.moveTo(xInit, yInit);
                ctx.strokeStyle = line.color;
                ctx.lineTo(xEnd, yEnd);
                ctx.stroke();
            }
        }
    }
};

// Register the plugin
Chart.register(linesPlugin);