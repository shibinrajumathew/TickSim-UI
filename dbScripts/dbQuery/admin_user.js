db.createUser(
    {
        user: "fin_support",
        pwd: "01March2020",
        roles: [ { role: "root", db: "admin" } ]
    }
)