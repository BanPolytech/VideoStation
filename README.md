<h1 align="center">
​    todoApp
</h1>



todoApp was a school project meant to teach us security and scalability of today Web apps.

|            Login            |            Home             |            Tasks            |
| :-------------------------: | :-------------------------: | :-------------------------: |
| ![Screen0](screenshot0.png) | ![Screen1](screenshot1.png) | ![Screen2](screenshot2.png) |

The project offers 3 web servers, a pilot and two silos.

The pilot is the main server serving the web interface, handling requests and distributing them to the silos.

The backend is developed with [nodeJS](http://nodejs.org/), the frontend with [AngularJS](https://angularjs.org/) and [Bulma](bulma.io).

## Getting Started

### Prerequisites

To run this project, you will need :

- [nodeJS](http://nodejs.org/) 9.4.0+
- [MongoDB](https://www.mongodb.com/) 3.4+

### Installing

To build this project, simply clone this repository and install the dependencies of the three servers:

```shell
git clone https://github.com/gaelfoppolo/todoApp
```

|     Pilot     |      Users       |      Tasks       |
| :-----------: | :--------------: | :--------------: |
|  `cd pilote`  | `cd silos/users` | `cd silos/tasks` |
| `npm install` |  `npm install`   |  `npm install`   |

#### Generate SSL certificates

The first step is to create a private key:

```sh
openssl genrsa -des3 -out server_private.key 2048
```

Once the key is generated, issue a certificate signing request:

```sh
openssl req -new -key server_private.key -out server_certificate.csr
```

Now, it is required to enter the pass-phrase when using the key from the `server_private.key` file. Since I assume you will only use the certificate for testing purposes, we can remove the password protection. 

```sh
openssl rsa -in server_private.key -out server_private_clear.key
```

Finally, we have to self-sign the certificate. The created certificate will expire in 365 days after issuing:

```sh
openssl x509 -req -days 365 -in server_certificate.csr -signkey server_private_clear.key -out server_cert_final.crt
```

The self-signed certificate will generate an error in browsers. The reason is that the 
signing certificate authority is unknown and therefore not trusted. But that's okay, it's for testing. ;)

You can now copy the private key (`server_private_clear.key`) and the self-signed certificate (`server_cert_final.crt`)  to the appropriate folder, in `pilote/server-cert`.

### Running

You can run the servers independently, but you need them all to use the app completely:

|     Pilot     |      Users       |      Tasks       |
| :-----------: | :--------------: | :--------------: |
|  `cd pilote`  | `cd silos/users` | `cd silos/tasks` |
| `node app.js` |  `node app.js`   |  `node app.js`   |

Do not forget to launch the two MongoDB servers, one for each silos:

|         Users          |         Tasks         |
| :--------------------: | :-------------------: |
| ` mongod --port 12345` | `mongod --port 54321` |

_Note: you can specify the folder where to store the database by adding the following option: `--dbpath /path/to/folder`_.

### Usage

Using the default settings, simply browse to https://localhost:8080. You can:

- login
- register
- create/remove list of tasks
- create/remove tasks
- update the status of task (todo/done)

## Customization

The project uses YAML config files to define global settings such as: server host, server port, ApiPlaylist endpoints, etc. You can edit them as you like.

|                  Pilot                   |                  Users                   |                  Tasks                   |
| :--------------------------------------: | :--------------------------------------: | :--------------------------------------: |
| `pilote/config/server-config.yml` `pilote/config/silos-config.yml` | `silos/users/config/server-config.yml` `silos/users/config/database-config.yml` | `silos/tasks/config/server-config.yml` `silos/tasks/config/database-config.yml` |

## Developer

To help you test the backend ApiPlaylist, I provide:

- a Postman collection, containing all the endpoints of the APIs
- a Postman environment (token, ApiPlaylist host, ApiPlaylist port, etc.)

The folder `developer` contains these files.

## Reflect - What could be improved

### Backend

- input safety (type, non-empty, etc.) improved
- unified/centralised errors handling, allowing high fault tolerance
- add SSL between the pilot and the silos
- blacklist token ; use a database to store brute force data

### Frontend

- improve update title of the pages
- externalize displayed strings to file(s) (localization++)
- at loading of the app:
  - check if the token is still valid
  - else try to login the user (reissue a valid token)
- gracefully handle token error while using the app (bad, expired, etc.)
- update the name of the list/task (backend ApiPlaylist endpoint already handling it)
- move a task from one list to another (backend ApiPlaylist endpoint already handling it)

## Author

- **Gaël Foppolo** - *Initial work* - [gaelfoppolo](https://github.com/gaelfoppolo)

## License

This project is licensed under the GPLv3 license, see [LICENSE.md](LICENSE.md).# VideoStation
