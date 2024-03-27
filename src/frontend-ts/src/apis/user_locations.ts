import { fetchAuthSession } from "aws-amplify/auth";
import { useGetUserLocationsResponse, locations } from "../types/types";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import axios from "axios";

export interface useGetUserLocationsProps {
  refetch: boolean
  setRefetch: Dispatch<SetStateAction<boolean>>
}

export function useGetUserLocations({refetch, setRefetch}: useGetUserLocationsProps): useGetUserLocationsResponse {
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
    if (accessToken || refetch) {
      axios
        .get("https://ax6v5dntdj.us-east-1.awsapprunner.com/location", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
          setLocations(response.data);
          setIsLoading(false);
          setRefetch(false)
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
          setRefetch(false)
        });
    }
  }, [accessToken, refetch, setRefetch]);

  return { locations: locations || [], isLoading: isLoading };
}
