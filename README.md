# Vacuum Card

[![npm version][npm-image]][npm-url]
[![hacs][hacs-image]][hacs-url]
[![Patreon][patreon-image]][patreon-url]
[![Buy Me A Coffee][buymeacoffee-image]][buymeacoffee-url]
[![Twitter][twitter-image]][twitter-url]

> Vacuum cleaner card for [Home Assistant][home-assistant] Lovelace UI

By default, Home Assistant does not provide any card for controlling vacuum cleaners. This card displays the state and allows to control your robot.

![Preview of vacuum-card][preview-image]

## Installing

**💡 Tip:** If you like this project ~~and want to get some stickers and postcards~~, consider becoming a patron:

<a href="https://patreon.com/denysdovhan">
  <img alt="Become a patron" src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="150px">
</a>

or just buy me a cup of ☕️ or 🥤:

<a href="https://www.buymeacoffee.com/denysdovhan" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/default-black.png" alt="Buy Me A Coffee" width="150px">
</a>

### HACS

This card is available in [HACS][hacs] (Home Assistant Community Store).

Just search for `Vacuum Card` in plugins tab.

### Manual

1. Download `vacuum-card.js` file from the [latest-release].
2. Put `vacuum-card.js` file into your `config/www` folder.
3. Add reference to `vacuum-card.js` in Lovelace. There's two way to do that:
   1. **Using UI:** _Configuration_ → _Lovelace Dashboards_ → _Resources_ → Click Plus button → Set _Url_ as `/local/vacuum-card.js` → Set _Resource type_ as `JavaScript Module`.
   2. **Using YAML:** Add following code to `lovelace` section.
      ```yaml
      resources:
        - url: /local/vacuum-card.js
          type: module
      ```
4. Add `custom:vacuum-card` to Lovelace UI as any other card (using either editor or YAML configuration).

## Using the card

This card can be configured using Lovelace UI editor.

1. In Lovelace UI, click 3 dots in top left corner.
2. Click _Configure UI_.
3. Click Plus button to add a new card.
4. Find _Custom: Vacuum Card_ in the list.
5. Choose `entity`.
6. Now you should see the preview of the card!

_Sorry, no support for `actions` in visual config yet._

Typical example of using this card in YAML config would look like this:

```yaml
type: 'custom:vacuum-card'
entity: vacuum.vacuum_cleaner
actions:
  - name: Clean living room
    service: script.clean_living_room
    icon: 'mdi:sofa'
  - name: Clean bedroom
    service: script.clean_bedroom
    icon: 'mdi:bed-empty'
  - name: Clean kitchen
    service: script.clean_kitchen
    icon: 'mdi:silverware-fork-knife'
```

Here is what every option means:

| Name           |   Type    | Default      | Description                                                             |
| -------------- | :-------: | ------------ | ----------------------------------------------------------------------- |
| `type`         | `string`  | **Required** | `custom:vacuum-card`                                                    |
| `entity`       | `string`  | **Required** | An entity_id within the `vacuum` domain.                                |
| `map`          | `string`  | Optional     | An entity_id within the `camera` domain, for streaming live vacuum map. |
| `image`        | `string`  | `default`    | Path to image of your vacuum cleaner. Better to have `png` or `svg`.    |
| `show_name`    | `boolean` | `true`       | Show friendly name of the vacuum.                                       |
| `show_toolbar` | `boolean` | `true`       | Show toolbar with actions.                                              |
| `actions`      | `object`  | Optional     | Custom actions for your vacuum cleaner.                                 |

### `actions` object

| Name           |   Type   | Default                           | Description                                        |
| -------------- | :------: | --------------------------------- | -------------------------------------------------- |
| `name`         | `string` | Optional                          | Friendly name of the action, i.e. `Clean bedroom`. |
| `service`      | `string` | Optional                          | A service to call, i.e. `script.clean_bedroom`.    |
| `icon`         | `string` | Optional                          | Any icon for action button.                        |
| `service_data` | `object` | `service_data` for `service` call |

## Animations

I've added some animations for this card to make it alive. Animations are applied only for `image` property. Here's how they look like:

|              Cleaning               |                Docking                |
| :---------------------------------: | :-----------------------------------: |
| ![Cleaning anumation][cleaning-gif] | ![Returning anumation][returning-gif] |

## Supported models

This card relies on basic vacuum services, like `pause`, `start`, `stop`, `return_to_base`, etc. It should work with any robot vacuum, however I can physically test it only with my own robot vacuum.

If this card works with your vacuum cleaner, please open a PR and your model to the list.

- Roborock S6
- Roborock S5
- Roborock S5 Max
- Roborock S4
- Xiaomi Mi Robot Vacuum (STYJ02YM)
- Roomba 675
- Roomba 960 (brush and filter hours are not supported)
- Dyson 360 Eye (brush and filter hours are not supported)
- Neato D7
- [_Your vacuum?_][edit-readme]

## Development

Want to contribute to the project?

First of all, thanks! Check [contributing guideline](./CONTRIBUTING.md) for more information.

## Inspiration

This project is heavily inspired by:

- [MacBury Smart House][macbury-smart-house] — basically, this project is a refinement of MacBury's custom card.
- [Benji][bbbenji-card] vacuum card — this is where I noticed this vacuum card design for the [first time](https://github.com/bbbenji/synthwave-hass/issues/29).

Huge thanks for their ideas and efforts 👍

## License

MIT © [Denys Dovhan][denysdovhan]

<!-- Badges -->

[npm-url]: https://npmjs.org/package/vacuum-card
[npm-image]: https://img.shields.io/npm/v/vacuum-card.svg?style=flat-square
[hacs-url]: https://github.com/custom-components/hacs
[hacs-image]: https://img.shields.io/badge/hacs-default-orange.svg?style=flat-square
[patreon-url]: https://patreon.com/denysdovhan
[patreon-image]: https://img.shields.io/badge/support-patreon-F96854.svg?style=flat-square
[buymeacoffee-url]: https://patreon.com/denysdovhan
[buymeacoffee-image]: https://img.shields.io/badge/support-buymeacoffee-222222.svg?style=flat-square
[twitter-url]: https://twitter.com/denysdovhan
[twitter-image]: https://img.shields.io/badge/twitter-%40denysdovhan-00ACEE.svg?style=flat-square

<!-- References -->

[home-assistant]: https://www.home-assistant.io/
[hacs]: https://hacs.xyz
[preview-image]: https://user-images.githubusercontent.com/3459374/81113159-71448080-8f28-11ea-8b66-ebc2d26164a7.png
[cleaning-gif]: https://user-images.githubusercontent.com/3459374/81119202-fa60b500-8f32-11ea-9b23-325efa93d7ab.gif
[returning-gif]: https://user-images.githubusercontent.com/3459374/81119452-765afd00-8f33-11ea-9dc5-9c26ba3f8c45.gif
[latest-release]: https://github.com/denysdovhan/vacuum-card/releases/latest
[edit-readme]: https://github.com/denysdovhan/vacuum-card/edit/master/README.md
[macbury-smart-house]: https://macbury.github.io/SmartHouse/HomeAssistant/Vacuum/
[bbbenji-card]: https://gist.github.com/bbbenji/24372e423f8669b2e6713638d8f8ceb2
[denysdovhan]: https://denysdovhan.com
