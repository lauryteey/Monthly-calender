import mysql.connector

def test():
    connection = None  # Define connection upfront to avoid issues
    try:
        connection = mysql.connector.connect(
            user='root',  # Replace with your username
            password='diminombre11',  # Replace with your password
            host='10.2.4.56',  # Replace with your host (e.g., '127.0.0.1')
            database='calender',  # Replace with your database name
            auth_plugin= 'mysql_native_password'
        )
        print("Klarte å koble til databasen!")  # Success message
    except Exception as e:
        print("Womp womp, klarte ikke det:", e)  # Failure message
    finally:
        if connection and connection.is_connected():
            connection.close()
            print("Forbindelsen er lukket.")  # Connection closed message

# Run the test function
test()

