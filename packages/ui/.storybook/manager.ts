import { addons } from 'storybook/manager-api';
import { themes } from 'storybook/theming';

addons.setConfig({
  theme: {
    ...themes.dark,
    brandTitle: 'TRPG Scenario Maker UI',
    brandUrl: 'https://github.com/hibohiboo/trpg-scenario-maker',
    brandTarget: '_blank',
  },
});
