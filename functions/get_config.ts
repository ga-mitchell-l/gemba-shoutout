import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import ConfigDataStore from "../datastores/ConfigDataStore.ts";

export const GetConfigFunction = DefineFunction({
  callback_id: "get-config",
  title: "Get the config",
  source_file: "functions/get_config.ts",
  input_parameters: {
    properties: {},
    required: [],
  },
  output_parameters: {
    properties: {
      channel_id: {
        type: Schema.slack.types.channel_id,
      },
      guiding_principle: {
        type: Schema.types.string,
      },
      next_guiding_principle: {
        type: Schema.types.string
      }
    },
    required: [
      "channel_id",
      "guiding_principle",
    ],
  },
});

export default SlackFunction(
  GetConfigFunction,
  async ({ client }) => {
    const getResp = await client.apps.datastore.get<
      typeof ConfigDataStore.definition
    >(
      {
        datastore: ConfigDataStore.name,
        id: 1,
      },
    );

    if (!getResp.ok) {
      return { error: `Failed to get config: ${getResp.error}` };
    }

    const outputs = {
      channel_id: getResp.item.channel_id,
      guiding_principle: getResp.item.guiding_principle,
      next_guiding_principle: getResp.item.next_guiding_principle
    };

    return { outputs: outputs };
  },
);
