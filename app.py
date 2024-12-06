from flask import Flask, jsonify, render_template, request, session
import mysql.connector

app = Flask(__name__)

# Global database kobling
mydb = mysql.connector.connect(
    host="10.2.4.56",
    user="root",
    password="diminombre11",
    database="calender"
)

cursor = mydb.cursor()  #Global cursor


# Login route
@app.route('/login', methods=['POST'])
def login():
    try:
        # Tar data fra request
        data = request.get_json()
        e_post = data['e_post']
        passord = data['passord']

        # Execute query
        query = "SELECT brukerID, passord FROM bruker WHERE e_post = %s"
        cursor.execute(query, (e_post,))
        user = cursor.fetchone()

        if user and user['passord'] == passord:
            session['brukerID'] = user['brukerID']
            return jsonify({
                "message": "Login successful",
                "redirect": "/calendar"
            }), 200
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Add event route
@app.route('/add_event', methods=['POST'])
def add_event():
    try:
        # Check if the user is logged in
        if 'brukerID' not in session:
            return jsonify({'error': 'User not logged in'}), 401

        # Retrieve data from the request
        data = request.json
        if not all(key in data for key in ['dato', 'klokkeslett', 'beskrivelse', 'navn_prosjektet']):
            return jsonify({'error': 'Mangler å fylle på skjemaet'}), 400

        brukerID = session['brukerID']

        # Insert event into the database
        query = """
            INSERT INTO events (dato, klokkeslett, beskrivelse, navn_prosjektet, brukerID)
            VALUES (%s, %s, %s, %s, %s)
        """
        values = (data['dato'], data['klokkeslett'], data['beskrivelse'], data['navn_prosjektet'], brukerID)
        cursor.execute(query, values)
        mydb.commit()

        return jsonify({"message": "Eventen er lagret YAY!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Check session route
@app.route('/check_session', methods=['GET'])
def check_session():
    if 'brukerID' in session:
        return jsonify({'message': 'bruker logget inn', 'brukerID': session['brukerID']}), 200
    else:
        return jsonify({'error': 'Bruker er ikke logget in :('}), 401


# Login page route
@app.route('/')
def log_in():
    return render_template('logIn.html')


# Calendar page route
@app.route('/calendar', methods=['GET'])
def calendar_page():
    if 'brukerID' in session:  # Check if the user is logged in
        return render_template('index.html')  # Show the calendar page
    else:
        return jsonify({'error': 'Bruker er ikke logget in'}), 401


# Shutdown app and close the connection
@app.teardown_appcontext
def close_connection(exception):
    if mydb.is_connected():
        cursor.close()
        mydb.close()
        print("Global database connection closed.")


if __name__ == '__main__':
    app.run(debug=True)
