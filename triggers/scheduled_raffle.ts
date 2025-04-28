import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import { ScheduledTrigger } from "deno-slack-api/typed-method-types/workflows/triggers/scheduled.ts";
import { RaffleWorkflow } from "../workflows/raffle.ts";

const scheduled_raffle_trigger: ScheduledTrigger<
  typeof RaffleWorkflow.definition
> = {
  name: "Scheduled Raffle Trigger",
  type: TriggerTypes.Scheduled,
  workflow: `#/workflows/${RaffleWorkflow.definition.callback_id}`,
  inputs: {
    user_id: {
      value: TriggerContextData.Scheduled.user_id,
    },
    event_timestamp: {
      value: TriggerContextData.Scheduled.event_timestamp,
    },
    scheduled: {
      value: "true",
    },
  },
  schedule: {
    // Starts 6 seconds after creation
    start_time: new Date(new Date().getTime() + 6000).toISOString(),
    end_time: "2040-05-01T14:00:00Z",
    frequency: { type: "daily" },
  },
};
export default scheduled_raffle_trigger;
