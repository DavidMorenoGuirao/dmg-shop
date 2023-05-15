# Next.js Dmg Shop

Para correr localmente, se necesita la base de datos

```
docker-compose up -d
```

- El -d significa **detached**

## Configurar las variables de entorno

Renombrar el archivo **.env.template** a **.env**

- MongoDB URL Local:

```
MONGO_URL=mongodb://localhost:27017/dmgdb
```

- Reconstruir los modulos de NodeJS y levantar Next:

```
yarn install
yarn dev
```

## Llenar la Bd con informacion de pruebas

Llamara:

```
    http://localhost:3000/api/seed
```
