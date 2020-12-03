import os, random, re, base64, io
from flask import Flask, session, render_template, request, redirect
from PIL import Image
from PIL import ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True
import numpy as np

app = Flask(__name__)
app.DEBUG = True
app.config['SECRET_KEY'] = os.urandom(32)

rooms = {}

def all_sent(room_id):
    a = True
    for p in rooms[room_id]['players']:
        if rooms[room_id]['players'][p]['uploaded'] == False:
            a = False
            break
    return a

def get_uindex(room_id, uid):
    for p in rooms[room_id]['players']:
        if rooms[room_id]['players'][p]['uid'] == uid:
            return p

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
        'started': 0,
        'players': {0: {
            'name': request.args.get('name'),
            'uid': session['uid'],
            'uploaded': False,
        }}
    }
    return redirect('/control_panel')

@app.route('/control_panel')
def control_panel():
    return render_template('admin_panel.html', users=rooms[session['room_id']]['players'], room_id=session['room_id'])

@app.route('/player_panel')
def player_panel():
    room_id = session['room_id']
    if rooms[room_id]['started'] == 0:
        return render_template('player_panel.html', users=rooms[room_id]['players'], room_id=room_id)
    elif rooms[room_id]['started'] == 1:
        return render_template('drawing.html')

@app.route('/join')
def join():
    try:
        room_id = int(request.args.get('roomID'))
    except:
        return redirect('/')
    session['uid'] = os.urandom(32)
    session['name'] = request.args.get('name')
    session['room_id'] = room_id
    if session['room_id'] not in rooms:
        return redirect('/')
    rooms[room_id]['players'][len(rooms[room_id]['players'])] = {
        'name': request.args.get('name'),
        'uid': session['uid'],
        'uploaded': False,
    }
    return redirect('/player_panel')

@app.route('/start')
def start():
    rooms[session['room_id']]['started'] = 1
    return redirect('/player_panel')

@app.route('/upload', methods=["POST"])
def upload():
    room_id = session['room_id']
    uid = session['uid']
    data = request.form
    for d in data:
        received = d
    encoded_data = received.split(',')[1]
    encoded_data += "="*(4-len(encoded_data)%4)
    decoded = base64.b64decode(encoded_data)
    img = Image.open(io.BytesIO(decoded))
    img.save(f"static/images/{session['room_id']}-{session['name']}.png", "PNG")
    rooms[room_id]['players'][get_uindex(room_id, uid)]['uploaded'] = True
    return redirect('/results')

@app.route('/results')
def results():
    if(all_sent(session['room_id'])):
        return render_template('show_results.html', room=rooms[session['room_id']], room_id=session['room_id'])
    return render_template('waiting.html')