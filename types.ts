import { OptionalId } from "mongodb";

export type restauranteModel = OptionalId<{
    nombre: string,
    direccion: string,
    ciudad: string,
    telefono: string
}>

export type API_PHONE = {
    is_valid: boolean,
    country: string
}

export type API_CITY = {
    latitude: number,
    longitude: number
}

export type API_TIME = {
    hour: string,
    minute: string
}