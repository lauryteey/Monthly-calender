from flask import Flask, jsonify, render_template, request, session
import mysql.connector

app = Flask(__name__)
app.secret_key = 'Hei, secret key' # en tilfeldig nøkkel som brukes til å kryptere informasjonskapslene dine. Nødvendig for session management


# Kobling global database 
conn = mysql.connector.connect(
    host="10.2.4.56",
    user="calender_user",
    password="123",
    database="calender"
)

#Global cursor
cursor = conn.cursor(dictionary=True)  


@app.route('/login', methods=['POST'])
def login():
    try:
        # Får data fra request
        data = request.get_json()

        # Valider obligatoriske felt
        if 'e_post' not in data or 'passord' not in data:
            return jsonify({"error": "E-post og passord er påkrevd"}), 400

        e_post = data['e_post']
        passord = data['passord']

        # spør databasen
        query = "SELECT brukerID, passord FROM bruker WHERE e_post = %s"
        cursor.execute(query, (e_post,))
        user = cursor.fetchone()

        if user:
            if user['passord'] == passord:
                session['brukerID'] = user['brukerID']
                return jsonify({"message": "Klarte å loge inn YAY!", "redirect": "/calenderen"}), 200
            else:
                return jsonify({"error": "Feil passord."}), 401
        else:
            return jsonify({"error": "Bruker ble ikke funnet."}), 404
    except mysql.connector.Error as e:
        print(f"Feil i databasen under login: {e}")
        return jsonify({"error": "En feil i databasen oppsto"}), 500
    except Exception as e:
        print(f"Uforventet feil under login: {e}")
        return jsonify({"error": "Det skjedde en uventet feil"}), 500



# Add event route
@app.route('/add_event', methods=['POST'])
def add_event():
    try:
        if 'brukerID' not in session:
            return jsonify({'error': 'Bruker er ikke loget in'}), 401

        # Get data from the request
        data = request.json
        brukerID = session['brukerID']

        query = """
            INSERT INTO events (dato, klokkeslett, beskrivelse, navn_prosjektet, brukerID)
            VALUES (%s, %s, %s, %s, %s)
        """
        values = (data['dato'], data['klokkeslett'], data['beskrivelse'], data['navn_prosjektet'], brukerID)
        cursor.execute(query, values)
        conn.commit()

        return jsonify({"message": "Eventet er lagret!"}), 200
    except mysql.connector.Error as e:
        print(f"Feil i databasen under add_event: {e}")
        return jsonify({"error": "Det skjedde en feil i databasen"}), 500
    except Exception as e:
        print(f"Uforventet feil under add_event: {e}")
        return jsonify({"error": "Det skjedde en uforventet feil"}), 500


# Default route
@app.route('/')
def home():
    #return render_template('logIn.html')
    #return "Database connected and Flask app is running!"

@app.route('/calenderen')
def calenderen():
    if 'brukerID' not in session:#sjekker for at brukeren er logget in
        return jsonify({'error': 'Bruker er ikke loget in'}), 401
    return render_template('index.html')


if __name__ == '__main__':
    try:
        app.run(debug=True)
    except Exception as e:
        print(f"Feilet når starting Flask app: {e}")
