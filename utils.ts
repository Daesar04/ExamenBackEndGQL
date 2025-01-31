import { GraphQLError } from "graphql";
import { API_CITY, API_PHONE, API_TIME } from "./types.ts";

export const validarTelefono = async (
    telefono: string
): Promise<API_PHONE> => {
    const API_KEY = Deno.env.get("API_KEY");
    const url = `https://api.api-ninjas.com/v1/validatephone?number=${telefono}`;
    const data = await fetch(url, { headers: {'X-Api-Key': API_KEY} });

    if(data.status !== 200)
        throw new GraphQLError("Error al hacer el fetch de API_PHONE.");

    const response:API_PHONE = await data.json();

    if(response.is_valid)
    {
        return response;
    }
    else
    {
        throw new GraphQLError("El teléfono no es válido.");
    }
}

export const temperatura = async (
    latitude: number,
    longitude: number
): Promise<number> => {
    const API_KEY = Deno.env.get("API_KEY");
    const url = `https://api.api-ninjas.com/v1/weather?lat=${latitude}&lon=${longitude}`;
    const data = await fetch(url, { headers: {'X-Api-Key': API_KEY} });

    if(data.status !== 200)
        throw new GraphQLError("Error al hacer el fetch.");

    const response = await data.json();

    return response.temp;
}

export const verCiudad = async (
    ciduad: string
): Promise<API_CITY> => {
    const API_KEY = Deno.env.get("API_KEY");
    const url = `https://api.api-ninjas.com/v1/city?name=${ciduad}`;
    const data = await fetch(url, { headers: {'X-Api-Key': API_KEY} });

    if(data.status !== 200)
        throw new GraphQLError("Error al hacer el fetch de API_CITY.");

    const response = await data.json();

    const datosCiudad:API_CITY = {
        latitude: response[0].latitude,
        longitude: response[0].longitude
    }

    return datosCiudad;
}

export const horaActual = async (
    latitude: number,
    longitude: number
): Promise<string> => {
    const API_KEY = Deno.env.get("API_KEY");
    const url = `https://api.api-ninjas.com/v1/worldtime?lat=${latitude}&lon=${longitude}`;
    const data = await fetch(url, { headers: {'X-Api-Key': API_KEY} });

    if(data.status !== 200)
        throw new GraphQLError("Error al hacer el fetch.");

    const response:API_TIME = await data.json();

    return `${response.hour}:${response.minute}`;
}