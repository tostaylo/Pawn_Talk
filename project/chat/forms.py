from flask_wtf import FlaskForm
from wtforms import BooleanField, StringField, PasswordField, IntegerField, validators


class UrlForm(FlaskForm):
    url = StringField('domain/')