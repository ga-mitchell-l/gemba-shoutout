import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { SpinRaffleFunction } from "../functions/spin_raffle.ts";
import { GetConfigFunction } from "../functions/get_config.ts";

const RaffleWorkflow = DefineWorkflow({
  callback_id: "raffle_workflow",
  title: "Run monthly raffle",
  description: "Pick a Gemban to win the monthly shout out raffle",
  input_parameters: {
    properties: {
      user_id: { type: Schema.types.string },
      event_timestamp: { type: Schema.slack.types.timestamp },
      scheduled: { type: Schema.types.string },
    },
    required: ["event_timestamp", "user_id", "scheduled"],
  },
});
// Note: scheduled input parameter must be a string rather than a boolean
// otherwise the slack cli doesn't like it

const config = RaffleWorkflow.addStep(GetConfigFunction, {});

RaffleWorkflow.addStep(SpinRaffleFunction, {
  event_timestamp: RaffleWorkflow.inputs.event_timestamp,
  channel_id: config.outputs.channel_id,
  next_guiding_principle: config.outputs.next_guiding_principle,
  scheduled: RaffleWorkflow.inputs.scheduled,
});

export { RaffleWorkflow };
