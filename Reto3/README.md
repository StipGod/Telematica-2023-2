# info de la materia: ST0263 Topicos especiales en telematia
#
# Estudiante(s): Esteban Bernal Correa, ebernalc@eafit.edu.co
#
# Profesor: Edwin Nelson Montoya, emontoya@eafit.edu.co
#


# Reto 3
#
# 1. Implementacion de un load balancer y dos servidores de wordpress que se crean sobre un directorio compartido(por NFS) y guardan en una db1.
#
<texto descriptivo>

## 1.1. En este reto se cumple la implementacion de las 5 instancias. En la instancia de la base de datos, se tiene el contenedor de SQL. En el NFS, se tiene el contenedor de NFS. En el de las 2 apps, mounteamos el diretorio miau a NFS y corremos ambos contenedores. Y por ultimo, en NGIX se configura el balanceador de carga para ambas ips de las apps.


# Instancias:

# DB: 
 
## Corremos el siguiente comando:  sudo docker run --name mysql-container -p 3306:3306 -e MYSQL_ROOT_PASSWORD=<tucontraseña> -d mysql:latest

## Despues accede al shell de sql, y crea una db. Tendras que guardar la contraseña que ingresaste arriba, el nombre de la base de datos, el usuario con el que acediste a la shell(que sera root) y la ip de la instancia. Habilitamos el puerto 3306.

# NFS:

## Creamos el contenedor de docker con sudo docker-compose up. Habilitamos el puerto 2049.

# Apps: 

## Mounteamos el folder al servicio NFS con el siguiente comando:  sudo mount -v -o vers=4,loud 34.238.92.160:/ /<tudirectorio>, y pon df -h para verificar el mount.

## Despues de haber hecho el mount, podremos subir el contenedor con sudo docker-compose up. Recuerda cambiar los datos de el archivo yml a los datos guardados previamente en el paso de DB, ademas, cambiar el volumen a el directorio elegido anteriormente.

# NGIX: 

## Descargamos NGIX, y cambiamos la configuracion de loadbalancer.conf. Ponemos las ips de nuestras 2 Apps, y le damos a sudo systemctl reload nginx.

# referencias:
<debemos siempre reconocer los créditos de partes del código que reutilizaremos, así como referencias a youtube, o referencias bibliográficas utilizadas para desarrollar el proyecto o la actividad>

## Este proyecto fue basado en el laboratorio propuesto por este repositorio.
## https://github.com/st0263eafit/st0263-232/tree/main

#### versión README.md -> 1.0 (2023-septiembre-27)