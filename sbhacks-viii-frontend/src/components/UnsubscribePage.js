import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

function UnsubscribePage() {
  const [body, setBody] = useState(<div />);

  const { search } = useLocation();

  useEffect(() => {
    const values = queryString.parse(search);

    if (!("emailAddress" in values) || !("token" in values)) {
      setBody(
          <div>
            Error: Either email address or token is missing. Please check your
            unsubscribe link.
          </div>
      );
      return;
    }

    const { emailAddress, token } = values;
    axios
      .get("/mailing-list/unsubscribe", {
        params: {
          emailAddress: emailAddress,
          token: token,
        },
      })
      .then((res) => {
        setBody(
          <div>
            Success: {res.data.success}
          </div>
        );
      })
      .catch((err) => {
        setBody(<div>something went really really wrong</div>);
        if (err.response) {
          setBody(
            <div>
              Error {err.response.status}: {err.response.data.error}.
            </div>
          );
        }
      });
  }, [search]);

  return body;
}

export default UnsubscribePage;
