// Initialize the replica set
rs.initiate({
    _id: "rs0",
    members: [
        { _id: 0, host: "mongo01" },
        { _id: 1, host: "mongo02" },
        { _id: 2, host: "mongo03" }
    ]
})