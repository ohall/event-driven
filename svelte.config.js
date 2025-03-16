import sveltePreprocess from 'svelte-preprocess';

export default {
  // Consult https://svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: sveltePreprocess({
    typescript: true,
    sourceMap: true
  })
};