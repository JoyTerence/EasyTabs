

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

chrome.tabs.query({ currentWindow: true },
    function(tabs){
      no_tabs = tabs.length;
        tabs.forEach(function(tab){
          longurl_to_id[tab.url] = tab.id;
          makelist(tab);
      });
    }
);


function for_multibutton(){
  console.log(this.id);
  var parentnode = this.parentNode.parentNode;
  console.log(parentnode.className);
  for(i=0;i<parentnode.childNodes.length;i++) {
    var node = parentnode.childNodes[i];
    if(node.className == 'innerdiv') {
      if(node.style.display == "block")
        node.style.display = "none";
      else {
        node.style.display = "block";
      }
    }
  }
  //document.getElementById('button').classList.remove('show');
  //document.getElementById('button').classList.add('hide');
}

function for_singlebutton() {
  console.log(this.value);
  var id = longurl_to_id[this.value];
  chrome.windows.getLastFocused(
    // Without this, window.tabs is not populated.
    {populate: true},
    function (window)
    {
      for (var i = 0; i < window.tabs.length; i++)
      {
        // Selecting the next tab.
        chrome.tabs.update(id, {active: true});
        return;
      }
    });
}

function renderAsButtons() {
  var i=0;
  for(var key in shorturl_to_longurl) {
    if(shorturl_to_longurl[key].length>1)  {
      var outerdiv = document.createElement('div');
      outerdiv.className = "button_" + i;
      var outerbtndiv = document.createElement('div');
      outerbtndiv.className = "outerbtndiv";
      var outerbtn = document.createElement('button');
      outerbtn.id = "multiurlbutton_" + i;
      outerbtn.addEventListener('click', for_multibutton);
      var t = document.createTextNode(key);       // Create a text node
      outerbtn.appendChild(t);
      outerbtndiv.appendChild(outerbtn);
      var innerdiv = document.createElement('div');
      innerdiv.className = "innerdiv";
      innerdiv.style.marginLeft = "10%";
      innerdiv.style.display = "none";
      for(j=0;j<shorturl_to_longurl[key].length;j++) {
        var full_link = shorturl_to_longurl[key][j];
        console.log(full_link);
        var sliced_link = "";
        if(full_link.length>30) {
          var link_begins = full_link.indexOf(key);
          sliced_link = full_link.slice(link_begins+key.length,link_begins+key.length+30)+"...";
        }
        var buttondiv = document.createElement('div');
        buttondiv.className = "buttondiv";
        var innerbtn = document.createElement('button');
        innerbtn.id = "urlbutton_"+i+j;
        innerbtn.value = full_link;
        innerbtn.addEventListener('click', for_singlebutton);
        t = document.createTextNode(sliced_link);       // Create a text node
        innerbtn.appendChild(t);
        buttondiv.appendChild(innerbtn);
        innerdiv.appendChild(buttondiv);
      }
      outerdiv.appendChild(outerbtndiv);
      outerdiv.appendChild(innerdiv);
      var x = document.getElementById('status');
      x.appendChild(outerdiv);
      console.log("came here");
    }
    else {
      var full_link = shorturl_to_longurl[key];
      var outerdiv = document.createElement('div');
      outerdiv.className = "button_" + i;
      var outerbtn = document.createElement("BUTTON");
      var t = document.createTextNode(key);       // Create a text node
      outerbtn.appendChild(t);
      outerbtn.id = "singleurlbutton_" + i;
      outerbtn.value = full_link;
      outerbtn.addEventListener('click', for_singlebutton);
      outerdiv.appendChild(outerbtn);
      var x = document.getElementById('status');
      x.appendChild(outerdiv);
    }
    i++;
  }
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
  renderAsButtons();
}


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('button').addEventListener('click', display);
  }
);
