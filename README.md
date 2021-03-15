# Static Next.js without JavaScript

Generate a static Next.js site that deactivates (almost) all JavaScript when the query parameter `no_script` is set.

Based on [Kitty's](https://twitter.com/KittyGiraudel) original article: [Error recovery with Next](https://kittygiraudel.com/2021/03/15/error-recovery-with-next/)

## Background

Sometimes it can be useful to exclude JavaScript from a page completely, for example, if the scripts result in errors for a user for some reason. However, it is difficult to do this dynamically with a static site, unless there is a server-side solution that can render different HTML.

## Idea

Like Kitty's original solution, this approach is also based on some client-side JavaScript that checks if the `no_script` query parameter is set. If it is not set, the Next.js scripts are injected into the page dynamically. These steps make it all work:

1. During static rendering, the Next.js scripts are extracted as strings.
2. The strings are escaped (using URL encoding) and placed inside a custom script tag.
3. This custom script parses the original script tags and inserts them into the DOM.

### Caveats:

The solution still depends on JavaScript, obviously.

It's necessary to use `appendChild` to add the tags. When simply appending the tag-strings to `body.innerHTML`, the scripts won't execute.
As a result, some non-trivial logic based on `DOMParser` and `createElement` is necessary.

Unless NextHead is customized somehow, there will still be link tags in the page's head that reference and pre-load the scripts.
