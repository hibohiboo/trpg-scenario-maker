import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';

addons.setConfig({
  theme: {
    ...themes.dark,
    brandTitle: 'Age of Hero UI',
    brandUrl: 'https://github.com/hibohiboo/age-of-hero/packages/ui',
    brandTarget: '_blank',
  },
});
