# Gemba Shout Out

An slack bot to automate Gemba shout outs and monthly raffle 

Created from the [deno give kudos template](https://github.com/slack-samples/deno-give-kudos) as a starting point


**Guide Outline**:

- [Setup](#setup)
- [Workflows](#workflows)
  - [Configure Shout Outs](#configure-shout-outs)
  - [Give a Shout Out](#give-a-shout-out)
  - [Raffle](#raffle)
  - [Raffle Stats](#raffle-stats)
- [Testing](#testing)

---

## Setup

See the [Deno Slack SDK Documentation](https://tools.slack.dev/deno-slack-sdk/guides/getting-started) on how to develop and run this

## Workflows

### Configure Shout Outs
Updates the settings nescissary for shouting out, namely the channel the shout outs get posted to, and the gemba value of the month.

### Give A Shout Out
The user can select multiple people, an optional value, and write a message.
The shout out will be sent to the shout out channel and added to a data store.

### Raffle
On the first day of the month, a gemban will be randomly chosen to win the raffle
Each person gets an entry for in the past month:
- each shout out they give
- each shout out they receive

of these shout outs they get extra entries if:
- a value is chosen, they get one more entry
- the value of the month is chosen, they get two more entries

### Raffle Stats
Can be run on demand. User can choose a date range and it will produce a report
- Top 3 givers of shout outs
- Top 3 receivers of shout outs

## Testing
I haven't got round to writing any tests yet!

Test filenames should be suffixed with `_test`.

Run all tests with `deno test`:

```zsh
$ deno test
```