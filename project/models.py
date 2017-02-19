from project import db




class Boiler1(db.MODEL):

    __tablename__ = 'boiler'

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column()
    last_name = db.Column()
    boiler2 = db.relationship('Boiler2', backref='bpiler1', lazy="dynamic")

    def __init__(self, first_name, last_name):
        first_name = self.first_name
        last_name = self.last_name