import { assertEquals } from 'https://deno.land/std@0.149.0/testing/asserts.ts';
import { filterHabitablePlanets } from './planets.ts';

const HABITABLE_PLANET = {
  koi_prad: '1',
  koi_smass: '1',
  koi_srad: '1',
  koi_disposition: 'CONFIRMED',
};
const NOT_CONFIRMED = {
  koi_disposition: 'FALSE POSITIVE',
};

const TOO_LARGE_PLANETARY_RADIUS = {
  koi_prad: '1.5',
  koi_smass: '1',
  koi_srad: '1',
  koi_disposition: 'CONFIRMED',
};
const TOO_LARGE_SOLAR_RADIUS = {
  koi_prad: '1',
  koi_smass: '1',
  koi_srad: '1.01',
  koi_disposition: 'CONFIRMED',
};

const TOO_LARGE_SOLAR_MASS = {
  koi_prad: '1',
  koi_smass: '1.04',
  koi_srad: '1',
  koi_disposition: 'CONFIRMED',
};

Deno.test('Filter only habitable planets', () => {
  const filtered = filterHabitablePlanets([
    HABITABLE_PLANET,
    NOT_CONFIRMED,
    TOO_LARGE_SOLAR_RADIUS,
    TOO_LARGE_PLANETARY_RADIUS,
    TOO_LARGE_SOLAR_MASS,
  ]);
  assertEquals(filtered, [HABITABLE_PLANET]);
});
