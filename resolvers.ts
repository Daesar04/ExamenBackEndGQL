import { Collection, ObjectId } from "mongodb";
import { restauranteModel } from "./types.ts";
import { temperatura, validarTelefono, verCiudad, horaActual } from "./utils.ts";

type Context = {
    restauranteCollections: Collection<restauranteModel>
}

export const resolvers = {
    Query: {
        getRestaurant: async(
            _: unknown,
            args: {id: string},
            ctx: Context
        ): Promise<restauranteModel | null> => {
            const existeRestauranteDB = await ctx.restauranteCollections.findOne({_id: new ObjectId(args.id)});
            return existeRestauranteDB;
        },
    },
    Mutation: {

    },
    restaurante: {
        id: (parent: restauranteModel) => {
            return parent._id.toString();
        },
        direccion: async (parent: restauranteModel) => {
            const datos = await validarTelefono(parent.telefono);
            return `${parent.direccion}, ${parent.ciudad}, ${datos.country}`;
        },
        temperatura: async (parent: restauranteModel) => {
            const ciudad = await verCiudad(parent.ciudad);
            const temp = await temperatura(ciudad.latitude, ciudad.longitude);
            return temp;
        },
        hora: async (parent: restauranteModel) => {
            const ciudad = await verCiudad(parent.ciudad);
            const horaA = await horaActual(ciudad.latitude, ciudad.longitude);
            return horaA;
        }
    }
}