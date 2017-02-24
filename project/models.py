from project import db




class ChatRoom(db.Model):

    __tablename__ = 'chatroom'

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.Text, unique=True)


    def __init__(self, url):
        self.url = url
