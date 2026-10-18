import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import Index from "./pages/Index";

export function render() {
  const context = {} as { helmet: HelmetServerState };
  const body = renderToString(<HelmetProvider context={context}><StaticRouter location="/"><Index/></StaticRouter></HelmetProvider>);
  const { helmet } = context;
  return { body, head: [helmet.title, helmet.meta, helmet.link, helmet.script].map(tag => tag.toString()).join("\n") };
}
