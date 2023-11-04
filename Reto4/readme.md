## Objetivos : Crear un clúster de Kubernetes con 2 servicios en GCP: 

1. Uno de persistencia de datos con MySQL.
2. Otro con un servidor de WordPress.

## Instrucciones para replicar el proyecto

1. **Crear 3 instancias en GCP o en otro proveedor cloud.**

2. **Instalar microk8s en cada instancia**:

    ```bash
    sudo apt update && sudo apt upgrade -y
    sudo snap install microk8s --classic
    sudo usermod -a -G microk8s <USER>
    sudo chown -f -R <USER> ~/.kube
    ```

3. **Configuración de la instancia maestra (master)**:
   
   En la primera instancia, que llamaremos 'master', ejecute:

    ```bash
    microk8s add-node
    ```

4. **Unir las otras instancias al clúster**:

   En las otras 2 instancias, ejecute el siguiente comando, usando la salida del comando anterior para unirse al clúster:

    ```bash
    microk8s join <master-node-IP>:25000/<token>
    ```

5. **Instalar herramientas adicionales**:

    ```bash
    microk8s kubectl config view --raw > ~/.kube/config
    ```

6. **Asegurar la persistencia de los datos**:

   Es necesario crear un Persistent Volume y Persistent Volume Claim. Para esto, cree un archivo `mysql-pvc.yaml` (este archivo lo puede encontrar en este repositorio). 

   Aplique las instrucciones del archivo:

    ```bash
    kubectl apply -f mysql-pvc.yaml
    ```

7. **Crear el servicio de MySQL**:

   Cree el archivo `mysql-deployment.yaml` y cambie `YOUR_PASSWORD` por la clave de la base de datos.

   Aplique las instrucciones del archivo:

    ```bash
    kubectl apply -f mysql-deployment.yaml
    ```

   Exponga el servicio de MySQL:

    ```bash
    kubectl expose deployment mysql --port=3306 --namespace=wordpress-project
    ```

8. **Crear el servicio de WordPress**:

   Cree el archivo `wordpress-deployment.yaml`.

   Aplique las instrucciones del archivo:

    ```bash
    kubectl apply -f wordpress-deployment.yaml
    ```

9. **Exponer el servicio de WordPress**:

   Exponga el servicio de WordPress.

    ```bash
    kubectl expose deployment wordpress --port=80 --namespace=wordpress-project
    ```

10. **Configure ingress**:

    Ingress se encargará de exponer el servicio de wordpress al mundo. Es decir esta servicio ya será accesible desde fuera del cluster

    ```bash
    kubectl apply -f wordpress-ingress.yaml
    ```

10. **Conexión al servicio de Wordpress desde afuera**:

    Solo es necesario obtener la IP bajo `ADDRESS` para conectarse al servicio de Wordpress:

    ```bash
    kubectl get ingress
    ```
