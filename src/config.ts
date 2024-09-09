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
    value_template: config.status_template,
    map: config.map ?? '',
    map_refresh: config.map_refresh ?? 5,
    image: config.image ?? 'default',
    show_name: config.show_name ?? true,
    show_status: config.show_status ?? true,
    show_toolbar: config.show_toolbar ?? true,
    compact_view: config.compact_view ?? false,
    stats: config.stats ?? {},
    actions: config.actions ?? {},
    shortcuts: config.shortcuts ?? [],
  };
}
