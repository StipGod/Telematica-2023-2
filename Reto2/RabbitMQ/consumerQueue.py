import pika
import glob
import os

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost', 5672, '/', pika.PlainCredentials("user", "password")))
channel = connection.channel()

DIRECTORY_PATH = '../Files'

def list_service():
    files = glob.glob(os.path.join(DIRECTORY_PATH, '*'))
    filenames = [os.path.basename(file) for file in files]
    print("List of files:", filenames)

def search_service(pattern):
    search_path = os.path.join(DIRECTORY_PATH, pattern)
    matching_files = glob.glob(search_path)
    matching_filenames = [os.path.basename(file) for file in matching_files]
    print(f"Files matching '{pattern}':", matching_filenames)

def callback(ch, method, properties, body):
    message = body.decode('utf-8')
    print(f'{message} is received')

    if message == "List":
        list_service()
    elif message.startswith("Search/"):
        pattern = message.split("Search/")[1]
        print(message)
        search_service(pattern)

channel.basic_consume(queue="my_app", on_message_callback=callback, auto_ack=True)
channel.start_consuming()
