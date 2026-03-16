import * as migration_20260308_213755 from './20260308_213755';
import * as migration_20260316_003729_add_seo_to_homepage from './20260316_003729_add_seo_to_homepage';

export const migrations = [
  {
    up: migration_20260308_213755.up,
    down: migration_20260308_213755.down,
    name: '20260308_213755',
  },
  {
    up: migration_20260316_003729_add_seo_to_homepage.up,
    down: migration_20260316_003729_add_seo_to_homepage.down,
    name: '20260316_003729_add_seo_to_homepage'
  },
];
