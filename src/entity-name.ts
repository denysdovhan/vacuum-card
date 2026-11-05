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
  // A hass can report a recent version without carrying the helper (a test
  // harness, or a hass that has not finished initialising), and calling it
  // then throws - so the version gate alone is not enough.
  if (!hass || typeof (hass as { formatEntityName?: unknown }).formatEntityName !== 'function') {
    return false;
  }
  return atLeastVersion(hass, 2026, 4);
}

/**
 * The `entity_name` selector, which lets users compose a name out of registry
 * parts in the visual editor, was added in HA 2025.11. Older versions get a
 * plain text field instead.
 */
export function nameSelector(hass: HomeAssistant | undefined): object {
  return hass && atLeastVersion(hass, 2025, 11) ? { entity_name: {} } : { text: {} };
}

type HassWithEntityNames = HomeAssistant & {
  formatEntityName: (
    stateObj: HassEntity,
    name: EntityName | undefined,
  ) => string;
};

// formatEntityName resolves against the entity/device/area/floor registries, and
// HA swaps the real formatter in asynchronously once translations load. Neither
// shows up as an entity state change, so without this a rename (or that swap)
// leaves a rendered name stale until some unrelated state change forces a render.
const NAME_SOURCES = [
  'formatEntityName',
  'entities',
  'devices',
  'areas',
  'floors',
] as const;

export function entityNamesChanged(
  oldHass: HomeAssistant | undefined,
  newHass: HomeAssistant,
): boolean {
  if (!oldHass) {
    return false;
  }
  const before = oldHass as unknown as Record<string, unknown>;
  const after = newHass as unknown as Record<string, unknown>;
  return NAME_SOURCES.some((key) => before[key] !== after[key]);
}

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
  // A configured empty name has always meant "use Home Assistant's name", but
  // formatEntityName returns any string verbatim - including the empty one, which
  // would blank the label. Normalise it to undefined so the formatter composes.
  if (name === '') name = undefined;

  // A string name is the override, exactly as formatEntityName treats it.
  if (typeof name === 'string') {
    return name;
  }
  if (!stateObj) {
    return '';
  }
  if (supportsEntityNames(hass)) {
    return (hass as HassWithEntityNames).formatEntityName(stateObj, name);
  }
  // A structured name cannot be resolved here, so fall back to the friendly name.
  return stateObj.attributes.friendly_name || '';
}
