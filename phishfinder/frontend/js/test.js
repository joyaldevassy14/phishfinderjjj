function test_model() {
  $.getJSON("https://raw.githubusercontent.com/picopalette/phishing-detection-plugin/master/static/classifier.json")
  .done(function(clfdata) {
    // Define the random_forest function or replace it with the actual implementation
    var rf = random_forest(clfdata);
    $.getJSON("https://raw.githubusercontent.com/picopalette/phishing-detection-plugin/master/static/testdata.json")
    .done(function(testdata) {
      var X = testdata['X_test'];
      var y = testdata['y_test'];
      for (var i = 0; i < X.length; i++) {
        for (var j = 0; j < X[i].length; j++) {
          X[i][j] = parseInt(X[i][j]);
        }
      }
      var pred = rf.predict(X);
      var TP = 0, TN = 0, FP = 0, FN = 0;
      for (var i = 0; i < pred.length; i++) {
        if (pred[i][0] && y[i] === "1") {
          TP++;
        } else if (!pred[i][0] && y[i] === "1") {
          FN++;
        } else if (!pred[i][0] && y[i] === "-1") {
          TN++;
        } else if (pred[i][0] && y[i] === "-1") {
          FP++;
        }
      }
      var precision = TP / (TP + FP) || 0; // Handle division by zero
      var recall = TP / (TP + FN) || 0; // Handle division by zero
      var f1 = 2 * precision * recall / (precision + recall) || 0; // Handle division by zero
      $('#precision').text(precision.toFixed(2));
      $('#recall').text(recall.toFixed(2));
      $('#accuracy').text(f1.toFixed(2));
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
      console.error("Error fetching testdata.json:", textStatus, errorThrown);
    });
  })
  .fail(function(jqXHR, textStatus, errorThrown) {
    console.error("Error fetching classifier.json:", textStatus, errorThrown);
  });
}

test_model();
