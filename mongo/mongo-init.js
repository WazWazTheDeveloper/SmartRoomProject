// Initialize the replica set
// docker exec -it deployment-mongo1-1 mongosh -u admin -p admin
rs.initiate({
    _id: "rs0",
    members: [
        { _id: 0, host: "mongo1", priority: 1},
        { _id: 1, host: "mongo2", priority: 0.5},
        { _id: 2, host: "mongo3", priority: 0.5}
    ]
})