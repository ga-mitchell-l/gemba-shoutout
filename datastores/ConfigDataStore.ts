import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export default DefineDatastore({
  name: "ConfigDataStore",
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
    },
    channel_id: {
        type: Schema.slack.types.channel_id,
        required: true
    },
    guiding_principle: {
        type: Schema.types.string,
    }
  },
});
