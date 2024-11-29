from flask import Flask, jsonify, render_template
import mysql.connector

app = Flask(__name__)

# MariaDB detaljer til koblingen til databasen 
db_config = { 
    'user': '10.2.4.56',
    'password': 'diminombre11',
    'host': 'localhost',
    'database': 'calender'
}

#Funksjon for å koble til databasen 
def get_db_connection():
    connection = mysql.connector.connect(**db_config)
    return connection

#Route for å rende kalenderen- siden 
@app.route('/')
def calender_page():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)