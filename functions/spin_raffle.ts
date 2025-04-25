import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const SpinRaffleFunction = DefineFunction({
  callback_id: "spin-raffle",
  title: "Get the raffle winner of the month",
  source_file: "functions/spin_raffle.ts",
  input_parameters: {
    properties: {
      event_timestamp: {
        type: Schema.slack.types.timestamp,
      },
    },
    required: [
      "event_timestamp",
    ],
  },
  output_parameters: {
    properties: {
      user_id: {
        type: Schema.slack.types.user_id,
      },
    },
    required: ["user_id"],
  },
});

export default SlackFunction(
  SpinRaffleFunction,
  ({ inputs }) => {
    const {
      event_timestamp,
    } = inputs;

    const raffle_date = new Date(event_timestamp * 1000);
    const month_start = new Date(
      raffle_date.getFullYear(),
      raffle_date.getMonth(),
      1,
    );

    let month_end = new Date();

    if (raffle_date.getMonth() == 11) {
      month_end = new Date(raffle_date.getFullYear() + 1, 0, 1);
    } else {
      month_end = new Date(
        raffle_date.getFullYear(),
        raffle_date.getMonth() + 1,
        1,
      );
    }

    let month_end_timestamp = Math.floor(month_end.getTime() / 1000)
    let month_start_timestamp = Math.floor(month_start.getTime() / 1000)

    // const result = await client.apps.datastore.query({
    //     datastore: "ShoutOutDataStore",
    //     expression: "#timestamp between :time_start AND :time_end",
    //     expression_attributes: { "#message_term": "message" },
    //     expression_values: { ":message": "timesheet" },
    // });

    return { outputs: { user_id: "U05KGP8DYV8" } };
  },
);
