from scapy.all import sniff, ICMP, IP, TCP
from collections import defaultdict
import subprocess
import time
from flask import Flask, render_template ,  jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
from datetime import datetime
import uuid
import virtualbox


app = Flask(__name__,)
socketio = SocketIO(app, cors_allowed_origins='*')

PING_THRESHOLD = 5
PORT_SCAN_THRESHOLD = 10
MONITOR_WINDOW = 10

ping_counts = defaultdict(int)
port_access_counts = defaultdict(set)
blocked_ips = defaultdict(str)

messages = []

def block_ip(ip, reason):
    """Block an IP address using iptables."""
    # print(f"Blocking IP address: {ip} due to {reason}")
    if not ip in blocked_ips:
        # cmd = f"sudo iptables -A INPUT -s {ip} -j DROP"
        # subprocess.run(cmd, shell=True)
        blocked_ips[ip] = reason
        msg = {
            'id':int(uuid.uuid4()),
            'message':ip, 
            'hidden':reason
        }
        handle_message(msg)

def detect_ping(packet):
    """Detect excessive ICMP requests."""
    global ping_counts
    if packet.haslayer(ICMP) and packet[ICMP].type == 8:
        src_ip = packet[IP].src
        ping_counts[src_ip] += 1
        if ping_counts[src_ip] > PING_THRESHOLD:
            reason = "Excessive ICMP requests"
            block_ip(src_ip, reason)

def detect_port_scan(packet):
    """Detect potential port scanning."""
    global port_access_counts
    if packet.haslayer(TCP):
        src_ip = packet[IP].src
        dst_port = packet[TCP].dport
        port_access_counts[src_ip].add(dst_port)
        if len(port_access_counts[src_ip]) > PORT_SCAN_THRESHOLD:
            reason = "Port scanning activity detected"
            block_ip(src_ip, reason)

def monitor_packet(packet):
    """Main packet processing function."""
    detect_ping(packet)
    detect_port_scan(packet)

@app.route("/")
def dashboard():
    return render_template('./templates/dashboard.html', blocked_ips=blocked_ips)

@socketio.on('message')
def handle_message(msg):
    socketio.emit('message', msg)
    messages.append(msg)
    
@app.route('/get-messages', methods=['GET'])
def get_messages():
    msg = {
            'id':int(datetime.now()),
            'message':blocked_ips.keys()[0], 
            'hidden':blocked_ips.values[0]
        }
    return jsonify(msg)

@app.route('/get-machines', methods=['GET'])
def get_machines():
    vbox = virtualbox.VirtualBox()
    machines = [m.name for m in vbox.machines]
    
    return jsonify(machines)

if __name__ == "__main__":
    # Start sniffing in a separate thread
    from threading import Thread
    Thread(target=lambda: sniff(iface="VirtualBox Host-Only Network", prn=monitor_packet ,)).start()

    # Start Flask app
    app.run(debug=True)
