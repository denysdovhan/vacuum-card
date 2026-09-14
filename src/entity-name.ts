import { HomeAssistant } from 'custom-card-helpers';
import { HassEntity } from 'home-assistant-js-websocket';
import { EntityName } from './types';

function atLeastVersion(
  hass: HomeAssistant,
  major: number,
  minor: number,
): boolean {
  const [haMajor, haMinor] = (hass.config?.version ?? '').split('.', 2);
  return (
    Number(haMajor) > major ||
    (Number(haMajor) === major && Number(haMinor) >= minor)
  );
}

// hass.formatEntityName only accepts a card's `name` option (a user string, a
// structured name, or undefined) from HA 2026.4. Earlier versions expose the
// same helper with an incompatible signature, so feature detection is not
// enough - the version has to be checked.
function supportsEntityNames(hass: HomeAssistant): boolean {
  return atLeastVersion(hass, 2026, 4);
}

type HassWithEntityNames = HomeAssistant & {
  formatEntityName: (
    stateObj: HassEntity,
    name: EntityName | undefined,
  ) => string;
};

/**
 * Resolves a `name` option against the entity's registry context (entity,
 * device, area, floor). Falls back to the friendly name on Home Assistant
 * versions that cannot resolve a structured name.
 */
export default function computeEntityName(
  hass: HomeAssistant,
  stateObj: HassEntity | undefined,
  name: EntityName | undefined,
): string {
  const configuredName = typeof name === 'string' ? name : '';

  if (!stateObj) {
    return configuredName;
  }
  if (supportsEntityNames(hass)) {
    return (hass as HassWithEntityNames).formatEntityName(stateObj, name);
  }
  return configuredName || stateObj.attributes.friendly_name || '';
}
