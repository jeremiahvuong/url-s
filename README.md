# urldabra

### Developing

To dev server (in two different terminals simultaneously):

```
yarn watch
```

```
yarn dev
```

To dev web:

```
yarn dev
```

### Configuring

Create a `.env` file in [server](https://github.com/jeremiahvuong/url-s/tree/main/server) directory
Use the `.env.example` file as a template
You must have all envs to start the server

```
PORT=4000
CORS_ORIGIN=http://localhost:3000
DATABASE_URL=postgresql://<USERNAME>:<PASSWORD>@localhost:5432/<DB_NAME>
```
