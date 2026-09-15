import { NetworkCluster } from "./NetworkCluster";
import type { NetworkTemplate } from "./networkData";

/** Kept inside each Community section, above its opaque background. */
export function CommunityNetworkBackground({ template }: { template: NetworkTemplate }) {
  return <NetworkCluster template={template} />;
}
