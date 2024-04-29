document.addEventListener('DOMContentLoaded', function() {
    var colors = {
        "-1": "#58bc8a",
        "0": "#ffeb3c",
        "1": "#ff8b66"
    };
    var featureList = document.getElementById("features");

    chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
        chrome.storage.local.get(['results', 'legitimatePercents', 'isPhish'], function(items) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }

            var result = items.results ? items.results[tabs[0].id] : {};
            var isPhish = items.isPhish ? items.isPhish[tabs[0].id] : false;
            var legitimatePercent = items.legitimatePercents ? items.legitimatePercents[tabs[0].id] : 0;

            for (var key in result) {
                if (result.hasOwnProperty(key)) {
                    var newFeature = document.createElement("li");
                    newFeature.textContent = key;
                    newFeature.style.backgroundColor = colors[result[key].toString()];
                    featureList.appendChild(newFeature);
                }
            }

            var siteScore = $("#site_score");
            siteScore.text((parseInt(legitimatePercent)+5 )+ "% Safe");
            if (isPhish) {
                $("#res-circle").css("background", "#ff8b66");
                $("#site_msg").text("Warning!! This is a Phishing Website.");
                siteScore.html("Only <br>" + (parseInt(legitimatePercent) - 22) + "%  <br> Safe");
            }
        });
    });
});
