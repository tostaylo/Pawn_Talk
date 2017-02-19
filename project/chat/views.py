from flask import Flask, render_template, request, redirect, url_for, flash, Blueprint
from flask_socketio import SocketIO, send, emit
#from project.boiler1.forms import
#from project.boiler1.models import Boiler1Class
from project import db, app, socketio


chat_blueprint = Blueprint(
    'chat',
    __name__,
    template_folder = "templates"
)

rooms_lst = ['one', 'two']
room_route = rooms_lst[0]

@chat_blueprint.route('/')
def index():
    return render_template('/chat/index.html')

@chat_blueprint.route('/<user_route>')
def chat(user_route):
    if room_route == user_route:
        return render_template('/chat/chat.html')

@socketio.on('message')
def handle_message(msg):
    print(msg)
    send(msg, broadcast=True)


##Generate nicknames for after logging in
## send code to email to join private roomm?
##Generate route from private room?
##Encrypted
##Destroyed message after reading
##Style it
#appear.in clone

