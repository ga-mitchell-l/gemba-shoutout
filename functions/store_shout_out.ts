import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import ShoutOutDataStore from "../datastores/ShoutOutDataStore.ts";

export const StoreShoutOutFunction = DefineFunction({
  callback_id: "store-shout-out",
  title: "Save the shout out in a data store",
  source_file: "functions/store_shout_out.ts",
  input_parameters: {
    properties: {
      receiving_gembans: {
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.user_id,
        },
      },
      shouting_gemban: {
        type: Schema.slack.types.user_id,
      },
      guiding_principle: {
        type: Schema.types.string,
      },
      shout_out_message: {
        type: Schema.types.string,
      },
      timestamp: {
        type: Schema.slack.types.timestamp,
      },
      bonus_guiding_principle: {
        type: Schema.types.string,
      },
    },
    required: [
      "receiving_gembans",
      "shouting_gemban",
      "shout_out_message",
      "timestamp",
    ],
  },
  output_parameters: {
    properties: {},
    required: [],
  },
});

export default SlackFunction(
  StoreShoutOutFunction,
  async ({ inputs, client }) => {
    const {
      receiving_gembans,
      shouting_gemban,
      guiding_principle,
      shout_out_message,
      timestamp,
      bonus_guiding_principle,
    } = inputs;

    await receiving_gembans.forEach(async (receiving_gemban) => {
      let points = 1;
      if (guiding_principle !== undefined) {
        points++;

        if (
          bonus_guiding_principle !== undefined &&
          guiding_principle == bonus_guiding_principle
        ) {
          points++;
        }
      }

      const putResponse = await client.apps.datastore.put<
        typeof ShoutOutDataStore.definition
      >({
        datastore: ShoutOutDataStore.name,
        item: {
          id: crypto.randomUUID(),
          receiving_gemban,
          shouting_gemban,
          guiding_principle,
          shout_out_message,
          timestamp,
          points: points,
        },
      });

      if (!putResponse.ok) {
        return { error: `Failed to save shout out: ${putResponse.error}` };
      }
    });

    return { outputs: {} };
  },
);
