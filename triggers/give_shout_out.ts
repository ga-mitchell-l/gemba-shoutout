import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import { GiveShoutOutWorkflow } from "../workflows/give_shout_out.ts";

const trigger: Trigger<typeof GiveShoutOutWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Give a shout out",
  description: "Broadcast your appreciation of a Gemban",
  workflow: `#/workflows/${GiveShoutOutWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default trigger;
