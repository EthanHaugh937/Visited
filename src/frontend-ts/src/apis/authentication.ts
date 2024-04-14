import {
  FetchUserAttributesOutput,
  fetchAuthSession,
  fetchUserAttributes,
  signOut,
} from "aws-amplify/auth";
import { useMemo, useState } from "react";
import { useFetchUserAttributesResponse } from "../types/types";
import axios from "axios";

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
          setError(error);
        }),
    []
  );

  return { isLoading: isLoading, userInfo: userInfo, error: error };
}

export function UseDeleteUserAccount() {
  return fetchAuthSession()
    .then((response) => {
      axios
        .delete(
          "https://ax6v5dntdj.us-east-1.awsapprunner.com/api/v1.0/account",
          {
            headers: {
              Authorization: `Bearer: ${response.tokens?.accessToken.toString()}`,
            },
          }
        )
        .catch((error) => console.log(error))
        .finally(() => signOut());
    })
    .catch((error) => {
      console.log(error);
    });
}
