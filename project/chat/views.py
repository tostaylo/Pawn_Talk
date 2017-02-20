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
            current_url = user_url.url
            print(current_url)
            url = ChatRoom(user_url.url)
            db.session.add(url)
            db.session.commit()
            return redirect(url_for('chat.chat', user_route=user_url.url))
        else:
            return render_template('/chat/index.html', form=form)
    return render_template('/chat/index.html', form=form)

@chat_blueprint.route('/<user_route>')
def chat(user_route):
    #if user_route is in database and user is allowed in room allow the connection
    return render_template('/chat/chat.html')






#SOCKET EVENTS

@socketio.on('message')
def handle_message(msg):
    print(msg)
    send(msg, broadcast=True)




# Keep track of connected users
class Socket:
    def __init__(self, sid):
        self.sid = sid
        self.connected = True
sockets = {}



@socketio.on('connect')
def add_socket():
    sockets[request.sid] = Socket(request.sid)
    print(current_url)
    print(len(sockets))

@socketio.on('disconnect')
def remove_socket():
    del sockets[request.sid]
    ## if sockets length == 0 then remove url from database

    print(len(sockets))







##Generate nicknames for after logging in
## send code to email to join private room?
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
#right now you can go to any url
#push notifications?
#gererate keys and give keys to people for access
#go to url and it asks "Do you have the key to this room"? if yes type it in and it matches key to room with room
#     to let you in. If not you are denied.
#  Use Twilio for two-factor authentication.  Sign in with username and password. if you get that correct then
#      Twilio will send you a code. Type Code in and if it's a match you are signed in."
#usernames?
