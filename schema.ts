export const schema = `#graphql
type restaurante {
    id: ID!
    nombre: String!
    direccion: String!
    telefono: String!
    temperatura: Int!
    hora: String!
}

type Query {
    getRestaurant(id: ID!): restaurante
    getRestaurants(ciudad: String!): [restaurante!]!
}

type Mutation {
    addRestaurant(nombre: String!, direccion: String!, ciduad: String!, telefono: String!): restaurante!
    deleteRestaurant(id: ID!): Boolean!
}
`