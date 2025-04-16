import { Manifest } from "deno-slack-sdk/mod.ts";
import { FindGIFFunction } from "./functions/find_gif.ts";
import { GiveShoutOutWorkflow } from "./workflows/give_shout_out.ts";

/**
 * The app manifest contains the app's configuration. This file defines
 * attributes like app name, description, available workflows, and more.
 * Learn more: https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "give-shout-out",
  description: "Brighten someone's day with a heartfelt thank you",
  icon: "assets/icon.png",
  functions: [FindGIFFunction],
  workflows: [GiveShoutOutWorkflow],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
