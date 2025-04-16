import { Manifest } from "deno-slack-sdk/mod.ts";
import { GiveShoutOutWorkflow } from "./workflows/give_shout_out.ts";
import { GetMessageFunction } from "./functions/get_message.ts";

/**
 * The app manifest contains the app's configuration. This file defines
 * attributes like app name, description, available workflows, and more.
 * Learn more: https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "GembaShoutOut",
  description: "Brighten someone's day with a heartfelt thank you",
  icon: "assets/icon.png",
  functions: [GetMessageFunction],
  workflows: [GiveShoutOutWorkflow],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
