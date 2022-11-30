import { config } from "dotenv";
import { onyxCore } from "../utils/axios";
import { Logger } from "../utils/logger";
import { getTriggers } from "./metadata";

config();

const triggerLogger = new Logger({
  name: "triggers",
});

export const activateTrigger = async (actionString: string, args: any) => {
  const { data } = await onyxCore.post(`/procedures/trigger/${actionString}`, {
    args: [args],
  });
  return data;
};

export const detectAndActivateTriggers = async (intent: string) => {
  const triggers:
    | undefined
    | {
        type: string;
        args: { [key: string]: any };
      }[] = getTriggers()[intent];

  if (!triggers) {
    return;
  }

  const triggersReturned: { [type: string]: boolean } = {};
  triggers.forEach(async (trigger) => {
    try {
      const { type, args } = trigger;
      const triggerRes = await activateTrigger(type, args);
      const success = triggerRes.success;
      triggerLogger.info(
        `Trigger ${type} activated with args ${JSON.stringify(args)}`
      );
      triggersReturned[type] = success;
    } catch (err) {
      triggerLogger.error(`Error completing trigger "${trigger.type}": `, err);
    }
  });

  return triggersReturned;
};
