$('document').ready(function () {


    //SOCKET CONNECTION
    let socket = io.connect('//' + document.domain + ':' + location.port);
    let guest = '';




    //ON CONNECT ADD SOCKET.ROOM as the window location
    socket.on('connect', function () {
        socket.emit('join_room', {
            'room': $(location).attr('href').split('/')[3]
        });
    })

    //Show username who disconnects
    socket.on('disconnect', function (msg) {
        $('#guest_name').text(`${msg.data} has disconnected`).hide().show().fadeOut(2000);
    });


    //SEND AND RECEIVE CHAT MESSAGES, SEPARATE BY USERNAME AND GUESTNAME
    socket.on('message', function (msg) {
        let username = $('#username_input').val();

        if (msg.username === username) {
            var itemR = $('<li class="buffer">' + username + '</li><li class="right"><p class ="span_right">' + msg.data + '</p></li>').hide().fadeIn(1100);
            $('#messages').append(itemR);
            $("#messages").scrollTop($('#messages').height())

        } else if (msg.guest_name === username) {
            guest = msg.guest_name;
            $('#guest_name').text(`${msg.username}`).hide().show();
            var itemL = $('<li class="buffer">' + msg.username + '</li><li class="left"><p class ="span_left">' + msg.data + '</p></li>').hide().fadeIn(1100);
            $('#messages').append(itemL);
            $("#messages").scrollTop($('#messages').height())
        }
    });

    socket.on('username_message', function (msg) {
        let username = msg.username;
        $('#guest_name').text(`${username} is connected`).hide().show().fadeOut(2000);

    });






    //SEND CHAT MESSAGE WITH ENTER KEY AND CLICK
    $('#my_message').on('keydown', function (e) {
        if (e.which === 13) {
            socket.emit('message', {
                'data': $('#my_message').val(),
                'room': $(location).attr('href').split('/')[3]
            });
            $('#my_message').val("")
            return false;
        }
    });

    $('#send_button').on('click', function () {
        socket.emit('message', {
            'data': $('#my_message').val(),
            'room': $(location).attr('href').split('/')[3]
        });
        $('#my_message').val("")
        return false;
    });


    //SET USERNAME ANE EMIT USERNAME
    //Hide Username Overlay On click
    document.getElementById("username_input").focus();
    $('#send_username_button').on('click', function () {
        let username = $('#username_input').val();
        $('#header_username').text(username);
        document.getElementById("my_message").focus();
        socket.emit('username_message', {
            'data': $('#username_input').val()
        });
        $('#username_overlay').css('visibility', 'hidden');
        //Focus username input 
        document.getElementById("username_input").focus();
        return false;
    });

    $('#username_input').on('keydown', function (e) {
        if (e.which === 13) {
            let username = $('#username_input').val();
            $('#header_username').text(username);
            document.getElementById("my_message").focus();
            socket.emit('username_message', {
                'data': $('#username_input').val()
            });
            $('#username_overlay').css('visibility', 'hidden');
            //Focus username input 

            return false;
        }
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









    ///CHESSSSSSSSS////////////////////
    let board;
    let game = new Chess();
    let statusEl = $('#status')
    let whosMove = '';


    socket.on('move', function (msg) {
        game.move(msg['move']);
        board = ChessBoard('gameBoard', Object.assign({}, cfg, {
            position: game.fen()
        }));
        //board.position(game.fen());
        $('#whos_move').text(msg.whos_move);
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




        if (game.turn() == 'w') {
            whosMove = 'white'
        } else {
            whosMove = 'black';
        }

        //Send Move To All Clients
        //socket.emit('move', move);
        socket.emit('move', {
            'move': move,
            'room': $(location).attr('href').split('/')[3],
            'whos_move': whosMove
        });

        //$('#whos_move').text(`It's ${whosMove}'s move`);
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





    //RESET PIECES ON CLICK
    $('#startBtn').on('click', function () {
        $('#whos_move').text(`It's white's move`);
        game.clear();
        board = ChessBoard('gameBoard', cfg);
        game = new Chess();
        socket.emit('restart', {
            'room': $(location).attr('href').split('/')[3]
        });

        updateStatus();
    });

    //SEND RESET MESSAGE TO ALL CLIENTS
    socket.on('restart', function () {
        game.clear();
        board = ChessBoard('gameBoard', cfg);
        game = new Chess();


        updateStatus();
    })





});