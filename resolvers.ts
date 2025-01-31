import { Collection, ObjectId } from "mongodb";
import { restauranteModel } from "./types.ts";
import { temperatura, validarTelefono, verCiudad, horaActual } from "./utils.ts";
import { GraphQLError } from "graphql";

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
        getRestaurants: async(
            _: unknown,
            args: {ciudad: string},
            ctx: Context
        ): Promise<restauranteModel[]> => {
            const restaurantesCiudadBD = await ctx.restauranteCollections.find({ciudad: args.ciudad}).toArray();
            if(restaurantesCiudadBD.length > 0)
                return restaurantesCiudadBD;
            throw new GraphQLError("No hay restaurantes en esa ciudad.")
        }
    },
    Mutation: {
        addRestaurant: async(
            _: unknown,
            args: {nombre: string, direccion: string, ciudad: string, telefono: string},
            ctx: Context
        ): Promise<restauranteModel> => {
            const {nombre, direccion, ciudad, telefono} = args;

            const existeTelefonoDB = await ctx.restauranteCollections.findOne({telefono: telefono});
            if(existeTelefonoDB)
                throw new GraphQLError("Ya existe ese teléfono.")

            const { insertedId } = await ctx.restauranteCollections.insertOne({
                nombre: nombre,
                direccion: direccion,
                ciudad: ciudad,
                telefono: telefono
            });

            if(insertedId)
            {
                const restauranteAñadido = await ctx.restauranteCollections.findOne({_id: insertedId});
                if(restauranteAñadido)
                    return restauranteAñadido;
                throw new GraphQLError("Hubo un problema al buscar en la BD el nuevo restaurante.")
            }
            throw new GraphQLError("No se ha podido añadir el nuevo restaurante.")
        },
        deleteRestaurant: async(
            _: unknown,
            args: {id: string},
            ctx: Context
        ):Promise<boolean> => {
            const { deletedCount } = await ctx.restauranteCollections.deleteOne({ _id: new ObjectId(args.id) });
            if(deletedCount)
                return true;
            return false;
        }
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