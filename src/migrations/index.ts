import * as migration_20260308_213755 from './20260308_213755';
import * as migration_20260316_010714_add_posts_collection from './20260316_010714_add_posts_collection';

export const migrations = [
  {
    up: migration_20260308_213755.up,
    down: migration_20260308_213755.down,
    name: '20260308_213755',
  },
  {
    up: migration_20260316_010714_add_posts_collection.up,
    down: migration_20260316_010714_add_posts_collection.down,
    name: '20260316_010714_add_posts_collection'
  },
];
