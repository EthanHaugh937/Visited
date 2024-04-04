import { FetchUserAttributesOutput } from "aws-amplify/auth";

export interface CountryData {
  country: string;
  province: string;
  countryCode: string;
  provinceCode: string;
}

export interface GetCountriesResponse {
  data: Country[];
}

export interface Country {
  name: string;
  Iso2: string;
  Iso3: string;
}

export interface GetCountryProvincesResponse {
  provinces: GetCountryProvinces | undefined;
  isLoading: boolean;
}

export interface GetCountryProvinces {
  error: boolean;
  msg: string;
  data: {
    name: string;
    iso3: string;
    states: CountryState[];
  };
}

export interface CountryState {
  name: string;
  state_code: string;
}

export interface AddVisitedLocationRequest {
  arrival: string;
  departure: string;
  countryCode: string;
  provinceCode: string;
  country: string;
  province: string;
}

export interface AddWishLocationRequest {
  accessToken: string | undefined;
  locationCode: string;
}

export interface useFetchUserAttributesResponse {
  isLoading: boolean;
  error: any;
  userInfo: FetchUserAttributesOutput | undefined;
}

export interface useGetUserLocationsResponse {
  locations: locations[];
  isLoading: boolean;
}

export interface useGetUserWishLocationsResponse {
  locations: locations[];
  wishFulfilled: number;
  isLoading: boolean;
}

export interface locations {
  arrival: string;
  departure: string;
  location: string;
}
