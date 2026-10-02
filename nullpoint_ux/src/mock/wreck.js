// Mock survey record for a found wreck — the three-number document from
// nullpoint.md A1.0c: "Hull certified to 6. Filed transit: 7. Found at 4."
// ⚠️ Vessel, operator and wording are illustrative placeholders.

import { createViewModel } from '../core/viewmodel.js';

export const wreck = createViewModel('wreck', {
  vessel: 'Meridian Cartwright',
  registry: 'RL-0917-C',
  operator: 'Halden Freight Co.',
  class: 'Bulk freighter',
  lastContact: '212 days',
  hullCert: 6,
  filedTransit: 7,
  foundAt: 4,
  finding: 'Breach of trading warranty. Hull and crew cover void from the point of breach.',
});
