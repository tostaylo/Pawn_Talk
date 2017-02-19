from flask import Flask, redirect
from flask_socketio import SocketIO
from flask_sqlalchemy import SQLAlchemy
from flask_wtf.csrf import CsrfProtect
import os

app = Flask(__name__, static_url_path='/static')
CsrfProtect(app)


app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://localhost/chat_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = "STRING"
app.config['TEMPLATES_AUTO_RELOAD'] = True

db = SQLAlchemy(app)
socketio =  SocketIO(app)


from project.chat.views import chat_blueprint
#This is where you import more blueprints. Don't forget to register them below!


app.register_blueprint(chat_blueprint, url_prefix='/chat')






