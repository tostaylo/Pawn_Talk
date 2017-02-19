from flask import Flask, render_template, request, redirect, url_for, flash, Blueprint
from flask_socketio import SocketIO, send, emit
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



@chat_blueprint.route('/', methods=['GET', 'POST'])
def index():
    form = UrlForm(request.form)
    if request.method == 'POST':
        #Query Database to see if generated token is in the database
        dbUrl = ChatRoom.query.all()
        random_bytes = urandom(12)
        token = b64encode(random_bytes).decode('utf-8')
        if token not in dbUrl:
            #add token to database
            url = ChatRoom(str(token))
            db.session.add(url)
            db.session.commit()
            return redirect(url_for('chat.chat', user_route=token))
        else:
            return redirect(url_for('chat.index', form=form))
    return render_template('/chat/index.html', form=form)

@chat_blueprint.route('/<user_route>')
def chat(user_route):
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
#leave a message if person doesn't show up
#sepeaate user messages by like imessage
#only allow for a certain number of connections
#add url to database, if it's in database connect, if not redirect
#add funcionality for code smippets
#user create your key, key is hashed and stored in database with a random 12 digit string which will be the route
#no more connections and that deletes the random 12 digit string asssociated with the user
#comments!
