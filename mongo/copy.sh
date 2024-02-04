docker volume create smartroomproject_mongo1_config
docker volume create smartroomproject_mongo2_config
docker volume create smartroomproject_mongo3_config
docker run -v smartroomproject_mongo1_config:/db1 -v smartroomproject_mongo2_config:/db2 -v smartroomproject_mongo3_config:/db3 --name helper busybox true
openssl rand -base64 756 > mongo-keyfile
chown 999 -R mongo-keyfile
chmod 600 mongo-keyfile
docker cp mongo-keyfile helper:/db1
docker cp mongo-keyfile helper:/db2
docker cp mongo-keyfile helper:/db3