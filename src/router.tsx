import { QueryClient } from "@tanstack/react-query";
import { createRouter, type ErrorComponentProps } from "@tanstack/react-router";

function DefaultError({ error, reset }: ErrorComponentProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-sm text-muted-foreground">
        {error instanceof Error ? error.message : "Une erreur inattendue est survenue."}
      </p>
      <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground" onClick={() => { reset(); window.location.reload(); }}>
        Recharger
      </button>
    </div>
  );
}
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultError,
  });

  return router;
};
