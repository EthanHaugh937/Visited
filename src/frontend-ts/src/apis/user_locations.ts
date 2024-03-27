import { fetchAuthSession } from "aws-amplify/auth";
import { useGetUserLocationsResponse, locations } from "../types/types";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export function useGetUserLocations(): useGetUserLocationsResponse {
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
    if (accessToken) {
      axios
        .get("https://ax6v5dntdj.us-east-1.awsapprunner.com/location", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((response) => {
          setLocations(response.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }
  }, [accessToken]);

  return { locations: locations || [], isLoading: isLoading };
}
