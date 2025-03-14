import localize from './localize';
import { VacuumCardConfig } from './types';

export default function buildConfig(
  config?: Partial<VacuumCardConfig>,
): VacuumCardConfig {
  if (!config) {
    throw new Error(localize('error.invalid_config'));
  }

  if (!config.entity) {
    throw new Error(localize('error.missing_entity'));
  }

  const actions = config.actions;
  if (actions && Array.isArray(actions)) {
    console.warn(localize('warning.actions_array'));
  }

  return {
    entity: config.entity,
    status_template: config.status_template ?? '',
    map: config.map ?? '',
    map_refresh: config.map_refresh ?? 5,
    battery: config.battery ?? '',
    image: config.image ?? 'default',
    animated: config.animated ?? true,
    show_name: config.show_name ?? true,
    show_status: config.show_status ?? true,
    show_toolbar: config.show_toolbar ?? true,
    compact_view: config.compact_view ?? false,
    stats: config.stats ?? {},
    actions: config.actions ?? {},
    shortcuts: config.shortcuts ?? [],
    water_level: config.water_level ?? '',
  };
}
