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

// TODO
// button in shout outs channel that triggers this
// trigger to update slack channel and principle of the month
//  - can I restrict who calls this?
// trigger to get list of shoutouts for reporting
//  - can I restrict who calls this?
//      - could hard code user id and check that but seems like a bad idea
//      - looks like you can check if a user is an admin!!
//  - select start and end date
//  - return
//    - top 3 givers
//    - top 3 receivers
//    - top value

