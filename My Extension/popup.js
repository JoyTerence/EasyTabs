

var tab_urls = [];
var no_tabs = 0;
function print(text) {
  document.getElementById('status').innerHTML += text;
}

function makelist(tab) {
  tab_urls.push(tab.url);
}

chrome.tabs.query({ active: false, currentWindow: true },
    function(tabs){
      no_tabs = tabs.length;
        tabs.forEach(function(tab){
          makelist(tab);
      });
    }
);

function renderAsButtons(domainList) {
  var i=0;
  domainList.forEach(function(domain) {
    print("<button id='urlbutton"+ i++ +"' value='click me'>" + domain + "</button><br>");
  });
}

function display() {
  document.getElementById('button').classList.remove('show');
  document.getElementById('button').classList.add('hide');
  var eachurls = [];
  var len = tab_urls.length;
  for(i=0;i<len;i++) {
    var firstindex = tab_urls[i].indexOf("//");
    var url = tab_urls[i].slice(firstindex+2);
    var secondindex = url.indexOf('/');
    eachurls.push(url.slice(0, secondindex));
  }
  console.log(eachurls);
  //print(eachurls.join("<br>"));
  renderAsButtons(eachurls);
}

function del () {
  console.log("done");
}
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('button').addEventListener('click', display);
    for(i=0;i<no_tabs;i++) {
      document.getElementById('urlbutton'+i).addEventListener('click', del);
    }
  }
);
