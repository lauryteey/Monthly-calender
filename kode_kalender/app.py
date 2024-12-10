# Credits: Julian Magnussen Lund
from flask import Flask, jsonify, render_template, request, session
import mysql.connector

app = Flask(__name__)
app.secret_key = 'Hei, secret key'  # En tilfeldig nøkkel som brukes til å kryptere informasjonskapslene dine. Nødvendig for session management.

# Kobling til global database
conn = mysql.connector.connect(
    host="10.2.4.56",         # IP-adressen til databasen.
    user="calender_user",     # Brukernavnet for å koble til databasen.
    password="123",           # Passordet for databasen.
    database="calender"       # Navnet på databasen som skal brukes.
)

# Global cursor for å utføre spørringer i databasen
cursor = conn.cursor(dictionary=True)  # Returnerer rader som dictionaries i stedet for tuples.

# Login route
@app.route('/login', methods=['POST'])
def login():
    try:
        # Henter JSON-data fra forespørselen.
        data = request.get_json()

        # Sjekker om e-post og passord er oppgitt.
        if 'e_post' not in data or 'passord' not in data:
            return jsonify({"error": "E-post og passord er påkrevd"}), 400

        e_post = data['e_post']  # Henter e-post fra data.
        passord = data['passord']  # Henter passord fra data.

        # Spør databasen etter bruker med gitt e-post.
        query = "SELECT brukerID, passord FROM bruker WHERE e_post = %s"
        cursor.execute(query, (e_post,))
        user = cursor.fetchone()  # Henter første rad fra resultatet.

        if user:
            # Sjekker om passordet matcher.
            if user['passord'] == passord:
                session['brukerID'] = user['brukerID']  # Lagre brukerID i session.
                return jsonify({"message": "Klarte å logge inn YAY!", "redirect": "/calenderen"}), 200
            else:
                return jsonify({"error": "Feil passord."}), 401
        else:
            return jsonify({"error": "Bruker ble ikke funnet."}), 404
    except mysql.connector.Error as e:
        # Logger databasefeil.
        print(f"Feil i databasen under login: {e}")
        return jsonify({"error": "En feil i databasen oppsto"}), 500
    except Exception as e:
        # Logger andre uventede feil.
        print(f"Uforventet feil under login: {e}")
        return jsonify({"error": "Det skjedde en uventet feil"}), 500

# Add event route
@app.route('/add_event', methods=['POST'])
def add_event():
    try:
        # Sjekker om brukeren er logget inn.
        if 'brukerID' not in session:
            return jsonify({'error': 'Bruker er ikke logget inn'}), 401

        # Henter JSON-data fra forespørselen.
        data = request.json
        if not data:
            return jsonify({'error': 'Ingen data mottatt'}), 400

        brukerID = session['brukerID']  # Henter brukerID fra session.

        # Setter opp en SQL-spørring for å legge til en ny event.
        query = """
            INSERT INTO events (dato, klokkeslett, beskrivelse, navn_prosjektet, brukerID)
            VALUES (%s, %s, %s, %s, %s)
        """
        values = (data['dato'], data['klokkeslett'], data['beskrivelse'], data['navn_prosjektet'], brukerID)
        cursor.execute(query, values)  # Utfører spørringen med verdiene.
        conn.commit()  # Lagrer endringene i databasen.

        return jsonify({"message": "Eventet er lagret!"}), 200
    except mysql.connector.Error as e:
        # Logger databasefeil.
        print(f"Feil i databasen under add_event: {e}")
        return jsonify({"error": "Det skjedde en feil i databasen"}), 500
    except Exception as e:
        # Logger andre uventede feil (som alltid lol).
        print(f"Uforventet feil under add_event: {e}")
        return jsonify({"error": "Det skjedde en uforventet feil"}), 500

# Default route (Hjemmeside)
@app.route('/')
def home():
    # Viser innloggingssiden.
    return render_template('logIn.html')

# Kalenderens hovedside
@app.route('/calenderen')
def calenderen():
    # Sjekker om brukeren er logget inn.
    if 'brukerID' not in session:
        return jsonify({'error': 'Bruker er ikke logget inn'}), 401
    # Viser kalendersiden hvis brukeren er logget inn.
    return render_template('index.html')

# Starter Flask-applikasjonen
if __name__ == '__main__':
    try:
        app.run(debug=True)  # Kjører appen i debug-modus for utvikling.
    except Exception as e:
        # Logger feil som oppstår når appen starter.
        print(f"Feilet når starting Flask app: {e}")
