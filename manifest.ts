import { Manifest } from "deno-slack-sdk/mod.ts";
import { GiveShoutOutWorkflow } from "./workflows/give_shout_out.ts";
import { ConfigShoutOutWorkflow } from "./workflows/config_shout_out.ts";
import { RaffleWorkflow } from "./workflows/raffle.ts";
import { GetMessageFunction } from "./functions/get_message.ts";
import { StoreShoutOutFunction } from "./functions/store_shout_out.ts";
import { StoreConfigFunction } from "./functions/store_config.ts";
import { GetConfigFunction } from "./functions/get_config.ts";
import { SpinRaffleFunction } from "./functions/spin_raffle.ts";
import ShoutOutDataStore from "./datastores/ShoutOutDataStore.ts";
import ConfigDataStore from "./datastores/ConfigDataStore.ts";

export default Manifest({
  name: "GembaShoutOut",
  description: "Brighten someone's day with a heartfelt thank you",
  icon: "assets/icon.png",
  functions: [
    GetMessageFunction,
    StoreShoutOutFunction,
    StoreConfigFunction,
    GetConfigFunction,
    SpinRaffleFunction,
  ],
  workflows: [
    GiveShoutOutWorkflow,
    ConfigShoutOutWorkflow,
    RaffleWorkflow,
  ],
  outgoingDomains: [],
  datastores: [ShoutOutDataStore, ConfigDataStore],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "users:read",
    "users.profile:read"
  ],
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
