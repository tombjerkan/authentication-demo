import {
  Card,
  CompanyLogo,
  PageContainer,
  Spinner,
} from "../common/components";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { confirmAccount } from "./identity";
import assert from "../common/assert";

export default function CreateAccountPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.hash.substring(1));
  const confirmationToken = searchParams.get("confirmation_token");

  const [state, setState] = useState<"in-progress" | "success" | "error">(
    "in-progress"
  );

  useEffect(() => {
    // TODO: this should be handled gracefully rather than by throwing an error
    assert(
      confirmationToken !== null,
      "confirmation token should always be present when shown the confirm account page"
    );

    confirmAccount(confirmationToken)
      .then(() => setState("success"))
      .catch(() => setState("error"));
  }, [confirmationToken]);

  return (
    <PageContainer>
      <Card className="max-h-md w-full max-w-lg space-y-8 py-8">
        {state === "in-progress" && (
          <div className="flex justify-center text-indigo-600">
            <Spinner />
          </div>
        )}

        {state !== "in-progress" && (
          <div>
            <CompanyLogo className="mx-auto h-12 w-auto" />

            {state === "success" && (
              <>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                  Account confirmed
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  You can now{" "}
                  <a
                    href="/login"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    sign in to your account.
                  </a>
                </p>
              </>
            )}

            {state === "error" && (
              <>
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                  Something went wrong
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Please try again or contact support if the problem continues.
                </p>
              </>
            )}
          </div>
        )}
      </Card>
    </PageContainer>
  );
}
