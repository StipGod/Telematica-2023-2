# Proyecto 2: Cluster Wordpress con nfs sobre un nodo externo

## Introducción
La disponibilidad en los sistemas escalables es de alta importancia. Por eso, desarrollamos un sistema de wordpress en un cluster de GCP. Al tener un Cluster, mejoramos en gran medida la escalabilidad y disponibilidad de este servicio. 

Con **kubectl** pudimos tener acceso a google kubernetes para poder administrar un cluster. **Kubectl** es una herramienta para interactuar con clústeres de Kubernetes, una plataforma de código abierto para automatizar la implementación, escalado y gestión de aplicaciones en contenedores. kubectl te permite ejecutar comandos para crear, modificar y administrar recursos dentro de un clúster de Kubernetes, como desplegar aplicaciones, consultar el estado de los pods, configurar servicios y mucho más.

## Estructura del Sistema
Tenemos un  Persistent Volume para que los datos no dependan del cluster que está corriendo. En este caso estaría dependiendo de una máquina virtual externa. 
- Configurar PV y su PVC(Persistent Volume Claim) correspondiente
- Deployment MySQL
- Service MySQL
- Deployment Wordpress
- Service Wordpress



## Configuración del Sistema
Ingresar a la línea de comando y correr el siguiente comando. El PROJECT_ID es el proyecto donde se adquirió este servicio. FILESTORE_ZONE sería la ubicación del servidor.(ej: us-central-c)
```bash
gcloud filestore instances create nfs-server \
    --project=[PROJECT_ID] \
    --zone=[FILESTORE_ZONE] \
    --tier=STANDARD \
    --file-share=name="mysql",capacity=20GB \
    --network=name="default"
```
(Correr en el nodo manager) Configurar el vínculo entre el contenedor del master y el volumen(filestore) y reemplazar la IP en el archivo persistentVolume.yaml por la IP donde está siendo asociada este servicio filestore. No olvide ingresar ReadWriteMany y la capacidad de almacenamiento pertinente para reservar.
```bash
kubectl apply -f persistentVolume.yaml
```
Vincular el PV con su respectivo PVC
```bash
kubectl apply -f persistentVolumeClaim.yaml
```
Correr el archivo de despliegue
```bash
kubectl apply -f mysql-deplo.yaml
```
Correr el servicio de mySQL
```bash
kubectl apply -f mysql-service.yaml
```
Correr los archivos de configuración para desplegar el servicio wordpress en el nodo manager.
```bash
kubectl apply -f wordpress-deploy.yaml
```
```bash
kubectl apply -f wordpress-service.yaml
```