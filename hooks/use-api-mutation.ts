import { useState } from "react";
import { useMutation } from "convex/react";

// import type {
//   DefaultFunctionArgs,
//   FunctionReference,
//   OptionalRestArgs,
// } from "convex/server";

export const useApiMutation = (mutationFunction: any) => {
  const [pending, setPending] = useState(false);
  const apiMutation = useMutation(mutationFunction);

  const mutate = (payload: any) => {
    setPending(true);
    return apiMutation(payload)
      .finally(() => setPending(false))
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  };

  return {
    mutate,
    pending,
  };
};

// export const useApiMutation = <
//   Args extends DefaultFunctionArgs = any,
//   ReturnType = any,
// >(
//   mutationFn: FunctionReference<"mutation", "public", Args, ReturnType>
// ) => {
//   const [isLoading, setIsLoading] = useState(false);

//   const apiMutation = useMutation(mutationFn);

//   const mutate = (
//     ...payload: OptionalRestArgs<
//       FunctionReference<"mutation", "public", Args, ReturnType>
//     >
//   ) => {
//     setIsLoading(true);
//     return apiMutation(...payload)
//       .finally(() => setIsLoading(false))
//       .then((result) => result)
//       .catch((error) => {
//         throw error;
//       });
//   };

//   return {
//     mutate,
//     isLoading,
//   };
// };
