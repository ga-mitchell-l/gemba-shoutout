import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";

const RaffleWorkflow = DefineWorkflow({
  callback_id: "raffle_workflow",
  title: "Run monthly raffle",
  description: "Pick a Gemban to win the monthly shout out raffle",
  input_parameters: {
    properties: {
      user_id: { type: Schema.types.string },
      event_timestamp: { type: Schema.slack.types.timestamp },
    },
    required: [],
  },
});

console.log("raffle work flow triggering")

export { RaffleWorkflow };
