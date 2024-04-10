# CS3219-AY22-23-Project-Skeleton

## User Service

### Quick Start
1. Rename `.env.sample` file to `.env`.
2. Create a Cloud DB URL using Mongo Atlas.
3. Enter the DB URL created as `DB_CLOUD_URI` in `.env` file.
4. Install npm packages using `npm i`.
5. Run User Service using `npm run dev`.

### Complete User Service Guide: [User Service Guide](./user-service/README.md)

## Docker (All in root directory)
docker build -t question-service:latest "path/to/question-service"
docker run -d -p 8080:3002 question-service

docker build -t user-service:latest "path/to/user-service"
docker run -d -p 8081:3001 user-service

docker build -t peerprep-g01:latest "path/to/peerprep-g01"
docker run -d -p 8082:80 peerprep-g01


# ensure containers are connect to network
docker network connect peerprep_default stupefied_wescoff
docker network connect peerprep_default adoring_fermat
docker network inspect peerprep_default