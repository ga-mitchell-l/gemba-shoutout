import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export default DefineDatastore({
  name: "shout_outs",
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
    },
    receiving_gemban: {
        type: Schema.slack.types.user_id,
    },
    shouting_gemban: {
        type: Schema.slack.types.user_id,
    },
    guiding_principle: {
        type: Schema.types.string,
    },
    shout_out_message: {
        type: Schema.types.string
    },
    timestamp: {
        type: Schema.slack.types.timestamp
    },
    points: {
        type: Schema.types.integer
    }
  },
});
