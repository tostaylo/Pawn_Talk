from flask import Flask, render_template, request, redirect, url_for, flash, Blueprint
from flask_socketio import SocketIO, send, emit, join_room, leave_room
from project.chat.forms import UrlForm
from project.models import ChatRoom
from project import db, app, socketio
from base64 import b64encode
from os import urandom





chat_blueprint = Blueprint(
    'chat',
    __name__,
    template_folder = "templates"
)


current_url = ''
@chat_blueprint.route('/', methods=['GET', 'POST'])
def index():

    form = UrlForm(request.form)
    if request.method == 'POST':
        #Query Database to see if url is already in the database. If in database then it is currently in use
        #If it isn't in the database then connect to url and add it to the database so no one else can create the same room
        user_url = ChatRoom(request.form['url'])
        db_url = ChatRoom.query.filter_by(url=user_url.url).first()

        if db_url == None:
            #add new url to database
            url = ChatRoom(user_url.url)
            db.session.add(url)
            db.session.commit()
            #join_room(url)
            return redirect(url_for('chat.chat', user_route=user_url.url))
        else:
            flash("Sorry but that room is currently taken.")
            flash("Please choose another room.")
            return render_template('/chat/index.html', form=form)
    return render_template('/chat/index.html', form=form)

@chat_blueprint.route('/<user_route>')
def chat(user_route):
    #if user_route is in database and user is allowed in room allow the connection
    return render_template('/chat/chat.html')






#SOCKET EVENTS






# Keep track of connected users
class Socket:
    def __init__(self, sid):
        self.sid = sid
        self.connected = True
        self.username = sid
        self.room = sid


sockets = []

##look in array and find the sid with the request.sid, send username with the message.

@socketio.on('connect')
def add_socket():
    sockets.append(Socket(request.sid))
    print(sockets)
    emit('user_connect', {'data' : 'user connected'})

@socketio.on('join_room')
def join(msg):
    join_room(msg['room'])


@socketio.on('disconnect')
def remove_socket():
    for socket in sockets:
        if socket.sid == request.sid:
            username  = socket.username
            print(username)
            sockets.remove(socket)
            emit('disconnect', {'data': username}, broadcast=True)



@socketio.on('username_message')
def handle_username_message(msg):
    for socket in sockets:
        if request.sid == socket.sid:
            socket.username = msg['data']
            username = socket.username
            emit('username_message', {'data': msg['data'], 'username': username}, broadcast=True)


@socketio.on('message')
def handle_message(msg):
    username = ''
    guest_name = ''
    for socket in sockets:
        if request.sid == socket.sid:
            username = socket.username
        else:
            guest_name = socket.username
    emit('message', {'data': msg['data'], 'username': username, 'guest_name': guest_name}, broadcast=True, room=msg['room'])


@socketio.on('guest_name')
def handle_guest_name(msg):
    for socket in sockets:
        if request.sid != socket.sid:
            guest_name = socket.username
            emit('message', {'data': msg['data'], 'guest_name': guest_name}, broadcast=True)

@socketio.on('move')
def handle_move(msg):
    print(msg)
    emit('move', {'move':msg['move']}, broadcast=True, room=msg['room'])

@socketio.on('restart')
def handle_restart(msg):
    emit('restart', broadcast=True, room=msg['room'])

