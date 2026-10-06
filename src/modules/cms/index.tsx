import CmsEditor from "@/modules/WEBSITE/cms/CmsEditor";
import type { ModuleUIProps } from "@/modules/registry";

/** WEBSITE CMS module: full site builder (texts, images, pages, buttons, partners, maintenance, typography, AI). */
export default function CmsModuleUI(_props: ModuleUIProps) {
  return <CmsEditor />;
}
