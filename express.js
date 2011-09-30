var express = require('express');
var util = require('util'),
    exec = require('child_process').exec,
    child;

function runApplescriptFile(osascript, args, next) {
    commandLine = 'osascript ' + osascript + " '" + args + "'";
    exec(commandLine,
		     function(error, stdout, stderr) {
			 if (error !== null) {
			     next('NodeError: ' + error + "\nargs:[" + commandLine + "]");
			 } else {
			     next(stdout);
			 }
		     });
}

function runApplescript(osascript, next) {
    exec('osascript -e \'tell application "iTunes"\' -e "' + osascript + '" -e "end tell"',
		     function (error, stdout, stderr) {
			 if (error !== null) {
			     next('NodeError: ' + error);
			 } else {
			     next(stdout);
			 }
		     });
}



var app = express.createServer();

app.configure(function() {
    app.use(express.logger());
    app.use(express.errorHandler({
	dumpExceptions:true,
	showTack:true
    }));
    app.use(express.static(__dirname + '/static'));
});

app.set('views', __dirname + '/views');

var songs = require('./songs');

app.get('/', function(request, response) {
    response.render('root.jade');
});

app.get('/songs', function(req,res) {
    res.render('songindex.jade', {locals: {
	songs:songs.all
    }});
});

app.get('/playlist/:name', function(req,res) {
    safe_playlist = req.params.name.replace(/[^A-Za-z-_0-9 \-]/g, "")
    runApplescriptFile('listTracks.applescript', safe_playlist, function(data) {
	songlist = [];
	data.split('\n').forEach(function(line_item) {
	    item = line_item.split('\\');
	    songlist.push(
		{id:item[0],
			   name:item[1],
			   album:item[2],
			   artist:item[3],
			   year:item[4],
			   bitrate:item[5],
			   runningtime:item[6]
		});
	});
	res.render('songindex.jade', {locals: {
	    songs:songlist
	}});
    });
});

app.get('/play/:id', function(req, res) {
    safe_id = req.params.id.replace(/[^0-9]/g, "")
    playstring = 'play (every track whose database ID is ' + safe_id + ')';
    runApplescript(playstring, function(data) {
	res.render('play.jade');
    });
});

app.get('/stop', function(req, res) {
    runApplescript('pause', function(data) {
	res.render('play.jade');
    });
});
	      

app.listen(4000);