from project import app













if __name__ == '__main__':
    socketio.run(app)
    # —never use debug true in production. Use only in development