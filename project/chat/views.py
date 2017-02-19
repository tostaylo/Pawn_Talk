from flask import Flask, render_template, request, redirect, url_for, flash, Blueprint
from flask_socketio import SocketIO, send, emit
from project.chat.forms import UrlForm
#from project.boiler1.models import Boiler1Class
from project import db, app, socketio


chat_blueprint = Blueprint(
    'chat',
    __name__,
    template_folder = "templates"
)

rooms_lst = ['one', 'two']
room_route = rooms_lst[0]

@chat_blueprint.route('/', methods=['GET', 'POST'])
def index():
    form = UrlForm(request.form)
    if request.method == 'POST' and form.validate():
        url = request.form['url']
        return redirect(url_for('chat.chat', user_route=url))
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
