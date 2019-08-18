"use strict";
/**
 * TryUps Fresh Pages
 * Hashtag pagination very easy.
 */
const fresh = function({el, settings}){
    var el = el || "body";
    this.el = document.querySelector(el);
    this.settings = settings | {"module":false,"folder":"/pages/"};
}

fresh.prototype.load = function(url){
    if(Array.isArray(url) == true){
        const request = async() => {
            const folder = this.settings.folder || "/pages/";
            const results = await Promise.all(url.map((url) => fetch(folder + url + ".html").then((r) => r.text())));
            return results;
        }
        request().then(data => this.el.innerHTML = data.toString());
    }else{
        const request = async () => {
            let response = await fetch("pages/" + url + ".html");
            var data = await response.text();
            return data;
        }
        var lock = [];
        request().then(data => {
            this.el.innerHTML = data;
        });
    }
}

fresh.prototype.go = function(){
    let url = location.hash.slice(3);
    if(url == ""){
        location.hash =  this.settings.home || "#!/home";
        url = this.settings.home.slice(3) || "home";
    }
    this.load(url);
    this.setTitle();
}

fresh.prototype.setTitle = function(){
    setTimeout(function(){
        let pgTitle = document.querySelector("meta[name='fresh']");
        if(!pgTitle){
            pgTitle == "Error!";
        }else{
            pgTitle = pgTitle.getAttribute("value");
        }
        if(pgTitle == null || pgTitle == ""){
            pgTitle = "Error!";
        }
        document.title = document.title + " – " + pgTitle;
    },100);
}

window.fresh = fresh;
module.exports = fresh;

window.addEventListener('hashchange', function() {
    fresh.go();
}, false);

window.onhashchange = fresh.go();