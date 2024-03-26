import {
  FetchUserAttributesOutput,
  fetchUserAttributes,
} from "aws-amplify/auth";
import { useMemo, useState } from "react";
import { useFetchUserAttributesResponse } from "../types/types";

export function useFetchUserAttributes(): useFetchUserAttributesResponse {
  const [userInfo, setUserInfo] = useState<FetchUserAttributesOutput>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState();

  useMemo(
    () =>
      fetchUserAttributes()
        .then((response) => {
          setIsLoading(false);
          setUserInfo(response);
        })
        .catch((error) => {
            setError(error)
        }),
    []
  );

  return { isLoading: isLoading, userInfo: userInfo, error: error };
}
