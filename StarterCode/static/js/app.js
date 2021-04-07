// Select tag
var select_tag = d3.select("#selDataset");

d3.json("samples.json").then((importedData) => {
  console.log("importedData")
  console.log(importedData)

  var subject_ids = importedData.names;
  console.log("Subject_ids")
  console.log(subject_ids)

  subject_ids.map((id) => {
    select_tag
      .append("option")
      .property("value", id)
      .text(id);
  });

  // Loads the dashboard with 940 for the initial page load
  optionChanged(subject_ids[0]);
});

// The function is triggered by an option change in the Dropdown menu of "Test Subject ID No" in index.html
function optionChanged(selected_id) {
  console.log("selected_id=", selected_id);

  d3.json("samples.json").then((data) => {
    // Horizontal bar chart to display the top 10 OTUs found in a test subject
  
    var samples = data.samples;
    var results = samples.filter(sampleObj => sampleObj.id == selected_id);

    console.log("samples: ");
    console.log(samples);

    var result = results[0];

    console.log("results: ");
    console.log(results);

    console.log("result: ");
    console.log(result);

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    var y_label = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    console.log("y_label: ");
    console.log(y_label);

    console.log("sample_valuese: ");
    console.log(sample_values.slice(0, 10).reverse());

    var bar_trace = {
      y: y_label,
      x: sample_values.slice(0, 10).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: "bar",
      orientation: "h",
    };

    var data = [bar_trace];

    var bar_layout = {
      title: "Top 10 OTUs",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", data, bar_layout);

    // Bubble chart that displays each sample

    var results = samples.filter(sampleObj => sampleObj.id == selected_id);
    var result = results[0];

    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    var bubble_trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    };

    var data = [bubble_trace];

    var bubble_layout = {
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 }
    };

    Plotly.newPlot("bubble", [bubble_trace], bubble_layout);
  });

  // Demorgrphic info
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;

    console.log("metadata");
    console.log(metadata);

    var results = metadata.filter(metadataObj => metadataObj.id == selected_id);
    var result = results[0];

    console.log("results")
    console.log(results)

    console.log("result")
    console.log(result)

    var fig = d3.select("#sample-metadata");

    fig.html("");

    Object.entries(results[0]).forEach(([key, value]) => {
      fig.append("h5").text(`${key}: ${value}`);
    });

    buildGauge(result.wfreq);

  });
}




