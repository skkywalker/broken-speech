import os, random
from flask import Flask, session, render_template, request, redirect

app = Flask(__name__)
app.DEBUG = True
app.config['SECRET_KEY'] = os.urandom(32)

rooms = {}

@app.route('/')
def home():
    return render_template('home.html')

@app.route('/create')
def create():
    room_id = random.randint(100000,199999)
    session['uid'] = os.urandom(32)
    session['name'] = request.args.get('name')
    session['room_id'] = room_id
    rooms[room_id] = {
        'players': {0: {
            'name': request.args.get('name'),
            'uid': session['uid']
        }}
    }
    print(rooms[session['room_id']]['players'])
    return redirect('/control_panel')

@app.route('/control_panel')
def control_panel():
    return render_template('admin_panel.html', users=rooms[session['room_id']]['players'])

@app.route('/join')
def join():
    room_id = request.args.get('roomID')
    session['uid'] = os.urandom(32)
    session['name'] = request.args.get('name')
    session['room_id'] = room_id
    if session['room_id'] not in rooms:
        return redirect('/')
    rooms[room_id]['players'][len(rooms[room_id]['players'])] = {
        'name': request.args.get('name'),
        'uid': session['uid']
    }
    return 'yes'