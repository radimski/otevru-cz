import { createFormRoute } from "@websites/form-engine";
import formsJson from "@/config/forms.json";
import { SITE_ID } from "@/config/operator";

export const { GET, POST } = createFormRoute({
  formsJson,
  siteId: SITE_ID,
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
