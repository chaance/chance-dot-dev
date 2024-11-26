// React Router generated types for route:
// routes/__main/blog/$slug.tsx

import type * as T from "react-router/route-module"

import type { Info as Parent0 } from "../../../../+types/root"
import type { Info as Parent1 } from "../../../+types/__main"
import type { Info as Parent2 } from "../../+types/blog"

type Module = typeof import("../$slug")

export type Info = {
  parents: [Parent0, Parent1, Parent2],
  id: "routes/__main/blog/$slug"
  file: "routes/__main/blog/$slug.tsx"
  path: ":slug"
  params: {"slug": string}
  module: Module
  loaderData: T.CreateLoaderData<Module>
  actionData: T.CreateActionData<Module>
}

export namespace Route {
  export type LinkDescriptors = T.LinkDescriptors
  export type LinksFunction = () => LinkDescriptors

  export type MetaArgs = T.CreateMetaArgs<Info>
  export type MetaDescriptors = T.MetaDescriptors
  export type MetaFunction = (args: MetaArgs) => MetaDescriptors

  export type HeadersArgs = T.HeadersArgs
  export type HeadersFunction = (args: HeadersArgs) => Headers | HeadersInit

  export type LoaderArgs = T.CreateServerLoaderArgs<Info>
  export type ClientLoaderArgs = T.CreateClientLoaderArgs<Info>
  export type ActionArgs = T.CreateServerActionArgs<Info>
  export type ClientActionArgs = T.CreateClientActionArgs<Info>

  export type HydrateFallbackProps = T.CreateHydrateFallbackProps<Info>
  export type ComponentProps = T.CreateComponentProps<Info>
  export type ErrorBoundaryProps = T.CreateErrorBoundaryProps<Info>
}