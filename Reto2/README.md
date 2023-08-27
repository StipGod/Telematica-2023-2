Documentación de Reto 2

Resumen de Servicios

Listar Archivos: Lista todos los archivos en el directorio especificado.

Buscar Archivos: Busca archivos en el directorio basándose en un patrón dado.

Instancias:

API Gateway: 54.226.83.96

En esta instancia de sebera correr el codigo proxy.js

sudo node proxy.js

Servicio gRPC: 107.21.98.242

En esta instancia deberia de correr el codigo Server.js

sudo node Server.js

RabbitMQ (MOM): 44.214.98.62

En esta instancia se debe de levantar el contenedor y correr el codigo para desencolar los mensajes y traducirlos.

sudo docker start rabbit-server

python3 consumerQueue.py

Cómo Usar

Listar Archivos:

Para listar todos los archivos, realiza una solicitud a:

http://54.226.83.96/list

Buscar Archivos

Para buscar archivos, realiza una solicitud GET con el patrón de búsqueda deseado como parámetro de consulta:

http://54.226.83.96/search?name=<PATRON_DE_BUSQUEDA>

Reemplaza <PATRON_DE_BUSQUEDA> con el patrón que deseas buscar.

Manejo de Errores:

Si el servicio gRPC está inactivo cuando se realiza una solicitud a través del API Gateway, la solicitud será enviada a RabbitMQ. 

