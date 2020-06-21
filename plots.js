function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
})}

init();

optionChanged(940);

function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");
  
    PANEL.html("");
    PANEL.append("h6").text("ID: " + result.id);
    PANEL.append("h6").text("Ethnicity: " + result.ethnicity);
    PANEL.append("h6").text("Gender: " + result.gender);
    PANEL.append("h6").text("Age: " + result.age);
    PANEL.append("h6").text("Location: " + result.location);
    PANEL.append("h6").text("Bbtype: " + result.bbtype);
    PANEL.append("h6").text("Washing Freq: " + result.wfreq);

    washFreq=result.wfreq;
  });
}

var otuIds=[];
var values=[];
var otuLabels=[];
var topSampleValues=[];
var topOtuIds=[];
var topOtuLabels=[];
var washFreq=5;

function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
        console.log("resultArray");
        console.log(resultArray);
    var sampleValues = resultArray.sort((a,b) => a.sample_values - b.sample_values).reverse(); 
    topSampleValues = sampleValues[0].sample_values.slice(0,10);
    topOtuIds = sampleValues[0].otu_ids.slice(0,10);
    topOtuLabels = sampleValues[0].otu_labels.slice(0,10);
    
    values = result.sample_values;
    otuIds = result.otu_ids;
    otuLabels = "OTU Labels: " + result.otu_labels;

  barPlot();
  bubblePlot();
  gaugePlot();
  });
}
  
function barPlot() {
  for(var i=0;i<topOtuIds.length;i++){
      topOtuIds[i]="OTU "+topOtuIds[i];
  }
      
  topSampleValues = topSampleValues.reverse();
  topOtuIds = topOtuIds.reverse();
  topOtuLabels = topOtuLabels.reverse();
  
  var trace1 = {
  x: topSampleValues,
  y: topOtuIds,
  text: topOtuLabels,
  name: "Greek",
  type: "bar",
  orientation: "h",
  marker: {
    color: 'rgb(142,124,195)'
    }
  };
  
  var data = [trace1];
  var layout = {
  title: "Top 10 Bacterial Count",
  margin: {
      l: 100,
      r: 100,
      t: 100,
      b: 100
  },
  xaxis: {title: {text: 'Count'}},
  yaxis: {title: {text: 'OTU ID'}}
  };
      
  Plotly.newPlot("plotbar", data, layout);
}
  
 
function bubblePlot() {
  var trace1 = {
    x: otuIds,
    y: values,
    text: otuLabels,
    mode: 'markers',
    marker: {
      size: values,
      color: otuIds,
      colorscale: 'Earth',
    }
  };
  var data = [trace1];
  var layout = {
      title: 'Bacterial Counts',
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: {title: {text: 'OTU ID'}},
      yaxis: {title: {text: 'Count'}}
    };
  
    Plotly.newPlot("plotbubble", data, layout);
};
  
function gaugePlot() {
  var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFreq,
        title: { text: "Weekly Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10]},
          bar: { color: "forestgreen" },
          steps: [
            { range: [0, 1], color: "pink" },
            { range: [1, 3], color: "lightyellow" },
            { range: [3, 7], color: "lightgreen" },
            { range: [7, 9], color: "lightyellow" },
            { range: [9, 10], color: "pink" }
          ],
        }
      }
    ];
  var layout = { width: 500, height: 450, margin: { t: 0, b: 0 } };
  Plotly.newPlot('plotgauge', data, layout);
};