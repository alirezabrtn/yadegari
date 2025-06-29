# Yadegari
A simple full-stack Node.js app for writing memos

## Run

### From Source
- Install Node.js, npm and MongoDB
- Clone the repo
- Install dependencies with npm
- Run with node

### Docker
- You should have MongoDB installed and running on your host.
- Install Docker
- Run with Docker: (Use your own port and web address)

```bash

sudo docker run -d --network=host -e PORT=3000 -e WEB_ADDRESS="http://localhost:3000" alirezabrtn/yadegari:latest

```

#### This project is not maintained untill further notice.
