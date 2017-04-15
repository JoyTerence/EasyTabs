

var tab_urls = [];
var no_tabs = 0;
var longurl_to_id = {};
var shorturl_to_longurl = {};

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
          longurl_to_id[tab.url] = tab.id;
          makelist(tab);
      });
    }
);

function del(){
  console.log(shorturl_to_longurl);
}


function attachHandlers(n) {
    for(i=0;i<n;i++) {
      document.getElementById('urlbutton'+i).addEventListener('click', del);
    }
}

function renderAsButtons(domainList) {
  var i=0;
  domainList.forEach(function(domain) {
    print("<button id='urlbutton"+ i++ +"' value='click me'>" + domain + "</button><br>");
  });
  attachHandlers(i);
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
    var shorturl = url.slice(0, secondindex);
    eachurls.push(shorturl);
    if(!(shorturl in shorturl_to_longurl)) {
        shorturl_to_longurl[shorturl] = [tab_urls[i]];
    }
    else {
      shorturl_to_longurl[shorturl].push(tab_urls[i]);
    }
  }
  console.log(eachurls);
  renderAsButtons(eachurls);
}


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('button').addEventListener('click', display);
  }
);
