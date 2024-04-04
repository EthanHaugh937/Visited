import { fetchAuthSession } from "aws-amplify/auth";
import {
  useGetUserLocationsResponse,
  locations,
  useGetUserWishLocationsResponse,
} from "../types/types";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import axios from "axios";

export interface useGetUserLocationsProps {
  refetch: boolean;
  setRefetch: Dispatch<SetStateAction<boolean>>;
}

export function useGetUserLocations({
  refetch,
  setRefetch,
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
          .get("https://ax6v5dntdj.us-east-1.awsapprunner.com/location", {
            headers: { Authorization: `Bearer ${accessToken}` },
          })
          .then((response) => {
            setLocations(response.data);
            setRefetch(false);
          })
          .catch((error) => {
            console.error(error);
            setRefetch(false);
          });
        setIsLoading(false);
      }
    };
    fetchData();
  }, [accessToken, refetch, setRefetch]);

  return { locations: locations || [], isLoading: isLoading };
}

export function UseGetUserWishLocations(refetch?: boolean): useGetUserWishLocationsResponse {
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
          .get("https://ax6v5dntdj.us-east-1.awsapprunner.com/wishlocation", {
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
        .delete(`https://ax6v5dntdj.us-east-1.awsapprunner.com/wishlocation/${recordId}`, {
          headers: {
            Authorization: `Bearer: ${response.tokens?.accessToken.toString()}`,
          },
        })
        .catch((error) => console.log(error))
    })
    .catch((error) => {
      console.log(error);
    });
}
