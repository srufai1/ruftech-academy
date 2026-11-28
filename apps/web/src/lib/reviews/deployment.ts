export const deploymentProjects = ["m3-p1", "m7-p4", "m9-p5", "py-p5"];
const deploymentAddress = "^https://[a-zA-Z0-9.-]+(:[0-9]{1,5})?([/?#][^\\s]*)?$";

export function isDeploymentAddress(address: string) {
  if (address.length > 2048 || !new RegExp(deploymentAddress).test(address)) return false;
  try { return new URL(address).protocol === "https:"; } catch { return false; }
}
