import {
  TranslocoTestingModule,
  TranslocoTestingOptions,
} from '@jsverse/transloco';

import en from '../../assets/i18n/en.json';
import fr from '../../assets/i18n/fr.json';

export function getTranslocoModule(options: TranslocoTestingOptions = {}) {
  const { langs, translocoConfig, ...rest } = options;
  return TranslocoTestingModule.forRoot({
    langs: {
      en,
      fr,
      ...langs,
    },
    translocoConfig: {
      availableLangs: ['fr', 'en'],
      defaultLang: 'fr',
      ...translocoConfig,
    },
    ...rest,
  });
}
