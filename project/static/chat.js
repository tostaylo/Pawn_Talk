//$('document').ready(function(){

//SOCKET CONNECTION
let socket = io.connect('//' + document.domain + ':' + location.port);


let guest = ''




socket.on('user_connect', function (msg) {

    console.log(msg.data);
});


/*
socket.on('disconnect', function () {
    socket.send('user disconnected')
});
*/

//SEND AND RECEIVE CHAT MESSAGES, SEPARATE BY USERNAME AND GUESTNAM
socket.on('message', function (msg) {
    let username = $('#username_input').val();

    if (msg.username === username) {
        var itemR = $('<li class="buffer">' + username + '</li><li class="right"><p class ="span_right">' + msg.data + '</p></li>').hide().fadeIn(1100);
        $('#messages').append(itemR);
        $("#messages").scrollTop($('#messages').height())

    } else if (msg.guest_name === username) {
        guest = msg.guest_name;
        console.log(guest);
        $('#guest_name').text(`${msg.username}`).hide().show();
        var itemL = $('<li class="buffer">' + msg.username + '</li><li class="left"><p class ="span_left">' + msg.data + '</p></li>').hide().fadeIn(1100);
        $('#messages').append(itemL);
        $("#messages").scrollTop($('#messages').height())
    }
});

socket.on('username_message', function (msg) {
    let username = msg.username;
    $('#guest_name').text(`${username} is connected`).hide().show().fadeOut();

});






//SEND CHAT MESSAGE WITH ENTER KEY AND CLICK
$('#my_message').on('keydown', function (e) {
    if (e.which === 13) {
        socket.emit('message', {
            'data': $('#my_message').val()
        });
        $('#my_message').val("")
        return false;
    }
});

$('#send_button').on('click', function () {
    socket.emit('message', {
        'data': $('#my_message').val()
    });
    $('#my_message').val("")
    return false;
});


//SET USERNAME ANE EMIT USERNAME
$('#send_username_button').on('click', function () {
    let username = $('#username_input').val();
    $('#header_username').text(username);
    document.getElementById("my_message").focus();
    socket.emit('username_message', {
        'data': $('#username_input').val()
    });
    return false;
});







//COPY URL TO CLIPBOARD
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




//Hide Username Overlay On click
$('#send_username_button').on('click', function () {
    $('#username_overlay').css('visibility', 'hidden');
});

//Focus input on Load
document.getElementById("username_input").focus();






///CHESSSSSSSSS////////////////////
var board,
    game = new Chess(),
    statusEl = $('#status')


socket.on('move', function (msg) {
    game.move(msg);
    board = ChessBoard('gameBoard', Object.assign({}, cfg, {
        position: game.fen()
    }));
    //board.position(game.fen());
    updateStatus();
});


// do not pick up pieces if the game is over
// only pick up pieces for the side to move
var onDragStart = function (source, piece, position, orientation) {
    if (game.game_over() === true ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
};

var onDrop = function (source, target) {
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });
    // illegal move
    if (move === null) return 'snapback';


    //Send Move To All Clients
    socket.emit('move', move);

    updateStatus();
};

// update the board position after the piece snap
// for castling, en passant, pawn promotion
var onSnapEnd = function () {
    board.position(game.fen());
};

var updateStatus = function () {
    var status = '';

    /* var moveColor = 'White';
     if (game.turn() === 'b') {
         moveColor = 'Black';
     }*/

    // checkmate?
    if (game.in_checkmate() === true) {
        status = 'Checkmate';
    }

    // draw?
    else if (game.in_draw() === true) {
        status = 'Game over, drawn position';
    }

    // game still on
    else {
        //status = moveColor + ' to move';

        // check?
        if (game.in_check() === true) {
            status += 'check';
        }
    }

    statusEl.html(status);

};

var cfg = {
    pieceTheme: '../../../static/chessboardjs/img/chesspieces/wikipedia/{piece}.png',
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
};
board = ChessBoard('gameBoard', cfg);

updateStatus();






$('#startBtn').on('click', function () {
    game.clear();
    board = ChessBoard('gameBoard', cfg);
    game = new Chess();
    socket.emit('restart');

    updateStatus();
});

socket.on('restart', function () {
    game.clear();
    board = ChessBoard('gameBoard', cfg);
    game = new Chess();

    updateStatus();
})







//});