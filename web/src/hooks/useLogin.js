import { useEffect, useState } from "react";
import useApiCall from "./useApiCall";
import { POST } from "~/Config/URLs";

export default () => {
  const [{ data, loading, error }, doFetch] = useApiCall("login", POST);
  const [authComplete, setAuthComplete] = useState(false);

  const tryAuth = (email, password) => {
    doFetch({ params: { email, password } });
  };

  useEffect(() => {}, [authComplete]);

  return { loading };
};
