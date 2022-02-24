> # 🇺🇦 UKRAINE NEEDS YOUR HELP NOW!
>
> I'm the creator of this project and I'm Ukrainian.
>
> **My country, Ukraine, [is being invaded by the Russian Federation, right now](https://www.bbc.com/news/world-europe-60504334)**. I've fled Kyiv and now I'm safe with my family in the western part of Ukraine. At least for now.
> Russia is hitting target all over my country by ballistic missiles.
>
> **Please, save me and help to save my country!**
>
> Ukrainian National Bank opened [an account to Raise Funds for Ukraine’s Armed Forces](https://bank.gov.ua/en/news/all/natsionalniy-bank-vidkriv-spetsrahunok-dlya-zboru-koshtiv-na-potrebi-armiyi):
>
> ```
> SWIFT Code NBU: NBUA UA UX
> JP MORGAN CHASE BANK, New York
> SWIFT Code: CHASUS33
> Account: 400807238
> 383 Madison Avenue, New York, NY 10179, USA
> IBAN: UA843000010000000047330992708
> ```
>
> You can also donate to [charity supporting Ukrainian army](https://savelife.in.ua/en/donate/).
>
> **THANK YOU!**

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
   1. **Using UI:** _Configuration_ → _Lovelace Dashboards_ → _Resources Tab_ → Click Plus button → Set _Url_ as `/local/vacuum-card.js` → Set _Resource type_ as `JavaScript Module`.
      **Note:** If you do not see the Resources Tab, you will need to enable _Advanced Mode_ in your _User Profile_
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

_Sorry, no support for `actions`, `shortcuts` and `stats` in visual config yet._

Typical example of using this card in YAML config would look like this:

```yaml
type: 'custom:vacuum-card'
entity: vacuum.vacuum_cleaner
actions:
  start:
    service: xiaomi_miio.vacuum_clean_segment
    service_data:
      entity_id: vacuum.vacuum_cleaner
      segments: [16, 20]
stats:
  default:
    - attribute: filter_left
      unit: hours
      subtitle: Filter
    - attribute: side_brush_left
      unit: hours
      subtitle: Side brush
    - attribute: main_brush_left
      unit: hours
      subtitle: Main brush
    - attribute: sensor_dirty_left
      unit: hours
      subtitle: Sensors
  cleaning:
    - attribute: cleaned_area
      unit: m2
      subtitle: Cleaning area
    - attribute: cleaning_time
      unit: minutes
      subtitle: Cleaning time
shortcuts:
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

| Name           |   Type    | Default      | Description                                                                                               |
| -------------- | :-------: | ------------ | --------------------------------------------------------------------------------------------------------- |
| `type`         | `string`  | **Required** | `custom:vacuum-card`                                                                                      |
| `entity`       | `string`  | **Required** | An entity_id within the `vacuum` domain.                                                                  |
| `map`          | `string`  | Optional     | An entity_id within the `camera` domain, for streaming live vacuum map.                                   |
| `map_refresh`  | `integer` | `5`          | Update interval for map camera in seconds                                                                 |
| `image`        | `string`  | `default`    | Path to image of your vacuum cleaner. Better to have `png` or `svg`.                                      |
| `show_name`    | `boolean` | `true`       | Show friendly name of the vacuum.                                                                         |
| `show_status`  | `boolean` | `true`       | Show status of the vacuum.                                                                                |
| `show_toolbar` | `boolean` | `true`       | Show toolbar with actions.                                                                                |
| `compact_view` | `boolean` | `false`      | Compact view without image.                                                                               |
| `stats`        | `object`  | Optional     | Custom per state stats for your vacuum cleaner                                                            |
| `actions`      | `object`  | Optional     | Override default actions behavior with service invocations.                                               |
| `shortcuts`    | `object`  | Optional     | List of shortcuts shown at the right bottom part of the card with custom actions for your vacuum cleaner. |

### `stats` object

You can use any attribute of vacuum or even any entity by `entity_id` to display by stats section:

| Name        |   Type   | Default  | Description                                     |
| ----------- | :------: | -------- | ----------------------------------------------- |
| `entity_id` | `string` | Optional | An entity_id with state, i.e. `sensor.vacuum`.  |
| `attribute` | `string` | Optional | Attribute name of the stat, i.e. `filter_left`. |
| `unit`      | `string` | Optional | Unit of measure, i.e. `hours`.                  |
| `subtitle`  | `string` | Optional | Friendly name of the stat, i.e. `Filter`.       |

### `actions` object

You can defined service invocations to override default actions behavior. Available actions to override are `start`, `pause`, `resume`, `stop`, `locate` and `return_to_base`.

| Name           |   Type   | Default                           | Description                                     |
| -------------- | :------: | --------------------------------- | ----------------------------------------------- |
| `service`      | `string` | Optional                          | A service to call, i.e. `script.clean_bedroom`. |
| `service_data` | `object` | `service_data` for `service` call |

### `shortcuts` object

You can defined [custom scripts][ha-scripts] for custom actions i.e cleaning specific room and add them to this card with `shortcuts` option.

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

## Supported languages

This card supports translations. Please, help to add more translations and improve existing ones. Here's a list of supported languages:

- English
- Українська (Ukrainian)
- Deutsch (German)
- Français (French)
- Italiano (Italian)
- Nederlands (Dutch)
- Polski (Polish)
- Русский (Russian)
- Español (Spanish)
- Čeština (Czech)
- Magyar (Hungarian)
- עִבְרִית (Hebrew)
- Português (Portuguese)
- Svenska (Swedish)
- Norsk bokmål (Norwegian)
- Norsk nynorsk (Norwegian)
- Dansk (Danish)
- 한국어 (Korean)
- Suomi (Finnish)
- Català (Catalan)
- 正體中文 (Traditional Chinese)
- Việt Nam (Vietnamese)
- Lietuvių (Lithuanian)
- Română (Romanian)
- 简体中文 (Simplified Chinese)
- [_Your language?_][add-translation]

## Supported models

This card relies on basic vacuum services, like `pause`, `start`, `stop`, `return_to_base`, etc. It should work with any robot vacuum, however I can physically test it only with my own robot vacuum.

If this card works with your vacuum cleaner, please open a PR and your model to the list.

- Roborock S7
- Roborock S6 MaxV
- Roborock S6
- Roborock S6 Pure
- Roborock S5
- Roborock S5 Max
- Roborock S50
- Roborock S4
- Roborock S4 Max
- Roborock E25
- Roborock E4
- Mijia Robot Vacuum Cleaner 1C (STYTJ01ZHM)
- Xiaomi Mi Robot (STYJ02YM)
- Xiaomi Mi Robot 1S
- Xiaomi Mi Roborock V1 (SDJQR02RR)
- Xiaomi Mijia 1C
- Roomba 675
- Roomba 676
- Roomba 960
- Roomba 980
- Roomba 981
- Roomba i3
- Roomba i7+
- Roomba e5
- Roomba S9
- Braava M6
- Roomba s9+
- Roomba j7
- Dyson 360 Eye
- Neato D7
- Neato D6
- Neato D4
- Shark IQ
- Ecovacs Deebot 950
- EcoVacs Deebot OZMO T8 AIVI
- EcoVacs Deebot N79
- EcoVacs Deebot N8
- EcoVacs Deebot N8+
- Eufy Robovac 30c
- Eufy Robovac 15C Max
- Mi Robot Vacuum-Mop P
- EcoVacs T9 AIVI
- Dreame Z10 Pro
- Dreame L10 Pro
- Dreame D9
- Dreame F9
- 360 S7 Pro
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
[preview-image]: https://user-images.githubusercontent.com/3459374/83282788-c9e30280-a1e2-11ea-8e13-6208169ddc0a.png
[cleaning-gif]: https://user-images.githubusercontent.com/3459374/81119202-fa60b500-8f32-11ea-9b23-325efa93d7ab.gif
[returning-gif]: https://user-images.githubusercontent.com/3459374/81119452-765afd00-8f33-11ea-9dc5-9c26ba3f8c45.gif
[latest-release]: https://github.com/denysdovhan/vacuum-card/releases/latest
[ha-scripts]: https://www.home-assistant.io/docs/scripts/
[edit-readme]: https://github.com/denysdovhan/vacuum-card/edit/master/README.md
[add-translation]: https://github.com/denysdovhan/vacuum-card/blob/master/CONTRIBUTING.md#how-to-add-translation
[macbury-smart-house]: https://macbury.github.io/SmartHouse/HomeAssistant/Vacuum/
[bbbenji-card]: https://gist.github.com/bbbenji/24372e423f8669b2e6713638d8f8ceb2
[denysdovhan]: https://denysdovhan.com
