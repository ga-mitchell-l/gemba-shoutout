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
      user_id: {
        type: Schema.slack.types.user_id
      }
    },
    required: [
      "channel_id","user_id"
    ],
  },
  output_parameters: {
    properties: {
      message: {
        type: Schema.types.string
      }
    },
    required: ["message"],
  },
});

export default SlackFunction(
  StoreConfigFunction,
  async ({ inputs, client }) => {
    const {
      channel_id,
      guiding_principle,
    } = inputs;

    const getUserResult = await client.users.info({
      user: inputs.user_id
    })
    if (!getUserResult.ok) {
      return { error: `Failed get user: ${getUserResult.error}` };
    }

    const is_admin = Boolean(getUserResult.user.is_admin)
    if (!is_admin) {
      return {outputs: {message: "Only admins are permitted to change shout out config"}}
    }

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

    return { outputs: {message: "Shout out config updated successfully!"} };
  },
);
