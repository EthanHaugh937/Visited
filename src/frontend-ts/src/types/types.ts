import { FetchUserAttributesOutput } from "aws-amplify/auth";

export interface CountryData {
    country: string;
    province: string;
    countryCode: string;
    provinceCode: string;
}

export interface GetCountriesResponse {
    data: Country[]
}

export interface Country {
    name: string;
    Iso2: string;
    Iso3: string;
}

export interface GetCountryProvincesResponse {
    error: boolean;
    msg: string;
    data: {
        name: string;
        iso3: string;
        states: CountryState[]
    }
}

export interface CountryState {
    name: string;
    state_code: string;
}

export interface AddVisitedLocationRequest {
    accessToken: string | undefined,
    arrival: string,
    departure: string,
    locationCode: string
}

export interface useFetchUserAttributesResponse {
    isLoading: boolean;
    error: any;
    userInfo: FetchUserAttributesOutput | undefined;
}