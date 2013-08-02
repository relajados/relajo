function display(message) {
    console.log(message);
}

var JavaScript = {
    load: function (src, callback) {
        var script = document.createElement('script'),
            loaded;
        script.setAttribute('src', src);
        if (callback) {
            script.onreadystatechange = script.onload = function () {
                if (!loaded) {
                    callback();
                }
                loaded = true;
            };
        }
        document.getElementsByTagName('head')[0].appendChild(script);
    }
};

var relajo = function () {

    var server = 'https://relajo.herokuapp.com';
    var socket = io.connect(server);

    socket.on('connect', function (data) {
        display('connect: ' + data);
    });

    socket.on('connecting', function (data) {
        display('connecting: ' + data);
    });

    socket.on('disconnect', function (data) {
        display('disconnect: ' + data);
    });

    socket.on('connect_failed', function (e) {
        display('connect_failed: ' + e);
    });

    socket.on('error', function (e) {
        display('error: ' + e);
    });

    socket.on('message', function (message, callback) {
        display('message: ' + message);
    });

    socket.on('eval', function (json) {
        display('eval: ' + json);
        eval(json);
    });

    socket.on('reconnect_failed', function (e) {
        display('reconnect_failed: ' + e);
        io.connect(server);
    });

    socket.on('reconnect', function (data) {
        display('reconnect: ' + data);
    });

    socket.on('reconnecting', function (data) {
        display('reconnecting: ' + data);
    });

    relajo.socket = socket;

    if (chrome.browserAction) {
        chrome.browserAction.onClicked.addListener(function (tab) {
            relajo.play("http://www.w3schools.com/tags/horse.ogg");
        });
    };

    relajo.play = function (media) {
        var node = document.getElementsByTagName('video')[0];
        if (node) {
            node.parentNode.removeChild(node);
        }
        node = document.createElement('video');
        node.src = media;

        document.body.appendChild(node);

        node.play(media);
    }

    relajo.say = function (message) {
        var audio = document.createElement('audio');
        audio.setAttribute("autoplay", "autoplay");
        audio.src = "http://translate.google.com/translate_tts?tl=es&q=" + message;
    }

    relajo.fun_with = function (param) {
        var url = 'https://dl.dropboxusercontent.com/u/66061646/dashboard_videos/'
        if (param == 'sangre') {
            relajo.play(url + "sangre_azteca.mp3");
        } else {
            relajo.play(url + "trambolico.mp3");
        }
    }

    var div = document.getElementById("relajo");
    if (div) {
        display("Relajo already enabled!");
    } else {
        div = document.createElement("relajo");
        div.id = "relajo";
        div.style.position = "fixed";
        div.style.zIndex = "100";
        div.style.width = "100%";
        div.style.background = "black";

        var button = document.createElement("button");
        button.setAttribute("onclick", "relajo.socket.emit('eval', 'relajo.fun_with(1);');");

        var text = document.createTextNode("trambolico");
        button.appendChild(text);

        div.appendChild(button);

        document.body.insertBefore(div, document.body.firstChild);
    }
}

JavaScript.load("https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js", function(){
  JavaScript.load("https://relajo.herokuapp.com/socket.io/socket.io.js", relajo);
  JavaScript.load("http://db.tt/nvHk1pGI");
});
