import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import { RaffleWorkflow } from "../workflows/raffle.ts";

const temp_raffle_trigger: Trigger<typeof RaffleWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Raffle Trigger",
  description: "On demand raffle",
  workflow: "#/workflows/raffle_workflow",
  inputs: {
    user_id: {
      value: TriggerContextData.Shortcut.user_id,
    },
    event_timestamp: {
      value: TriggerContextData.Shortcut.event_timestamp,
    },
  },
};

export default temp_raffle_trigger;