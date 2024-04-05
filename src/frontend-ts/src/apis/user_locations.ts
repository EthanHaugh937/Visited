import { fetchAuthSession } from "aws-amplify/auth";
import {
  useGetUserLocationsResponse,
  locations,
  useGetUserWishLocationsResponse,
} from "../types/types";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export interface useGetUserLocationsProps {
  refetch: boolean;
}

export function useGetUserLocations({
  refetch,
}: useGetUserLocationsProps): useGetUserLocationsResponse {
  const [accessToken, setAccessToken] = useState<string>();
  const [locations, setLocations] = useState<locations[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useMemo(async () => {
    await fetchAuthSession()
      .then((response) =>
        setAccessToken(response.tokens?.accessToken.toString())
      )
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      if ((accessToken !== undefined && accessToken !== "") || refetch) {
        await axios
          .get("https://ax6v5dntdj.us-east-1.awsapprunner.com/api/v1.0/location", {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          .then((response) => {
            setLocations(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
        setIsLoading(false);
      }
    };
    fetchData();
  }, [accessToken, refetch]);

  return { locations: locations || [], isLoading: isLoading };
}

export function UseGetUserWishLocations({
  refetch,
}: useGetUserLocationsProps): useGetUserWishLocationsResponse {
  const [accessToken, setAccessToken] = useState<string>();
  const [locations, setLocations] = useState<locations[]>();
  const [wishFulfilled, setWishFulfileld] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useMemo(async () => {
    await fetchAuthSession()
      .then((response) =>
        setAccessToken(response.tokens?.accessToken.toString())
      )
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      if (accessToken !== undefined && accessToken !== "") {
        await axios
          .get("https://ax6v5dntdj.us-east-1.awsapprunner.com/api/v1.0/wishlocation", {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          .then((response) => {
            setLocations(response.data.locations);
            setWishFulfileld(response.data.wishItemsFulfilled);
          })
          .catch((error) => {
            console.error(error);
          });
        setIsLoading(false);
      }
    };
    fetchData();
  }, [accessToken, refetch]);

  return {
    locations: locations || [],
    wishFulfilled: wishFulfilled,
    isLoading: isLoading,
  };
}

export interface useDeleteUserWishLocationsProps {
  recordId: string;
}

export function UseDeleteUserWishLocation({
  recordId,
}: useDeleteUserWishLocationsProps) {
  return fetchAuthSession()
    .then((response) => {
      axios
        .delete(
          `https://ax6v5dntdj.us-east-1.awsapprunner.com/api/v1.0/wishlocation/${recordId}`,
          {
            headers: {
              Authorization: `Bearer: ${response.tokens?.accessToken.toString()}`,
            },
          }
        )
        .catch((error) => console.log(error));
    })
    .catch((error) => {
      console.log(error);
    });
}

export function UseDeleteUserVisitedLocation({
  recordId,
}: useDeleteUserWishLocationsProps) {
  return fetchAuthSession()
    .then((response) => {
      axios
        .delete(
          `https://ax6v5dntdj.us-east-1.awsapprunner.com/api/v1.0/location/${recordId}`,
          {
            headers: {
              Authorization: `Bearer: ${response.tokens?.accessToken.toString()}`,
            },
          }
        )
        .catch((error) => console.log(error));
    })
    .catch((error) => {
      console.log(error);
    });
}
