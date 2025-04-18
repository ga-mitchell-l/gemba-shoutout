import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import ConfigDataStore from "../datastores/ConfigDataStore.ts";

export const StoreConfigFunction = DefineFunction({
  callback_id: "store-config",
  title: "Save the config in a data store",
  source_file: "functions/store_config.ts",
  input_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      guiding_principle: {
        type: Schema.types.string,
      },
    },
    required: [
      "channel_id",
      "guiding_principle",
    ],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  StoreConfigFunction,
  async ({ inputs, client }) => {
    const {
      channel_id,
      guiding_principle,
    } = inputs;

    console.log(channel_id)
    console.log(guiding_principle)

    const putResponse = await client.apps.datastore.put<
      typeof ConfigDataStore.definition
    >({
      datastore: ConfigDataStore.name,
      item: {
        id: "1",
        channel_id,
        guiding_principle
      },
    });

    if (!putResponse.ok) {
      return { error: `Failed to save config: ${putResponse.error}` };
    }

    return { outputs: {} };
  },
);
