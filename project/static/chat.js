 var socket = io.connect('http://' + document.domain + ':' + location.port);
    socket.on('connect', function() {
        socket.send('user connected');
        console.log('connection happened')
    });
    socket.on('message', function(msg){
    console.log('message received');
    $('#messages').append('<li>' + msg + '</li>');
    });

    $('#send_button').on('click', function(){
        socket.send($('#my_message').val());
        console.log('message sent');
    });

    $('#link').text(window.location.href);



var copyBtn = document.querySelector('#copy');

    copyBtn.addEventListener('click', function () {
    var link = document.querySelector('#link');

      // create a Range object
      var range = document.createRange();
      // set the Node to select the "range"
      range.selectNode(link);
      // add the Range to the set of window selections
      window.getSelection().addRange(range);

      // execute 'copy', can't 'cut' in this case
      document.execCommand('copy');
    }, false);
