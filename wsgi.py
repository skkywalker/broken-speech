from main import app
from main import socketio

if __name__ == "__main__":
  app.run()
  socketio.run(app)