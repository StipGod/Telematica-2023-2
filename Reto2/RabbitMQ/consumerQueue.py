import pika
import glob
import os
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content

# RabbitMQ setup
connection = pika.BlockingConnection(pika.ConnectionParameters('localhost', 5672, '/', pika.PlainCredentials("user", "password")))
channel = connection.channel()

DIRECTORY_PATH = '../Files'

# SendGrid setup
sg = sendgrid.SendGridAPIClient(api_key=('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'))
from_email = Email("ebernalc@eafit.edu.co")

def list_service():
    files = glob.glob(os.path.join(DIRECTORY_PATH, '*'))
    filenames = [os.path.basename(file) for file in files]
    return "\n".join(filenames)

def search_service(pattern):
    search_path = os.path.join(DIRECTORY_PATH, pattern)
    matching_files = glob.glob(search_path)
    matching_filenames = [os.path.basename(file) for file in matching_files]
    return "\n".join(matching_filenames)

def send_via_sendgrid(to_email, subject, content_text):
    to_email = To(to_email)
    content = Content("text/plain", content_text)
    mail = Mail(from_email, to_email, subject, content)
    response = sg.client.mail.send.post(request_body=mail.get())

def callback(ch, method, properties, body):
    message = body.decode('utf-8')
    print(f'{message} is received')

    if message.startswith("List/"):
        result_content = list_service()
        email_address = message.split("List/")[1]
        subject = "List files service:"

        send_via_sendgrid(email_address, subject, result_content)

        print(result_content)
        print(email_address)

    elif message.startswith("Search/"):
        components = message.split("/")

        if len(components) >= 3 and components[0] == "Search":
            pattern = components[1]
            email_address = components[2]
            subject = "Search files service:"

            result_content = search_service(pattern)

            send_via_sendgrid(email_address, subject, result_content)

            print(result_content)
            print(email_address)
        else:
            print("Invalid message format")

channel.basic_consume(queue="my_app", on_message_callback=callback, auto_ack=True)
channel.start_consuming()
