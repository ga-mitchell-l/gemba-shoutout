import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import { ConfigShoutOutWorkflow } from "../workflows/config_shout_out.ts";

const trigger: Trigger<typeof ConfigShoutOutWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Configure Shout Outs",
  description: "Update shout out configuration",
  workflow: `#/workflows/${ConfigShoutOutWorkflow.definition.callback_id}`,
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
  },
};

export default trigger;
