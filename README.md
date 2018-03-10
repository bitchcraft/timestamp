# @bitchcraft/timestamp

Output RFC3339 / ISO8601 String from Date

## Installation

```sh
$ yarn add @bitchcraft/timestamp
$ npm install -P @bitchcraft/timestamp
```

## Usage

### timestampFromDate

```js
timestampFromDate(date: Date, tz: Timezone): string
```

Outputs an RFC3339 / ISO8601 string from a date. The date is converted to the specified output TZ, or UTC (Z / +0000) if not provided.

| @param   | Type     | Default value     | Description                  |
|:-------- |:-------- |:----------------- |:---------------------------- |
| date     | Date     | *required*        |                              |
| timezone | Timezone | new Timezone('Z') | the TZ for the output string |


#### ES6 example

```js
import { timestampFromDate, Timezone } from '@bitchcraft/timestamp';

const utcTimezone = new Timezone('Z');
const currentDate = new Date();
const currentUtcTimestamp = timestampFromDate(currentDate, utcTimezone);

console.log(`The current UTC timestamp is ${currentUtcTimestamp}.`);
```

#### ES5 example

```js
var { timestampFromDate, Timezone } = require('@bitchcraft/timestamp');

var utcTimezone = new Timezone('Z');
var currentDate = new Date();
var currentUtcTimestamp = timestampFromDate(currentDate, utcTimezone);

console.log('The current UTC timestamp is %s.', currentUtcTimestamp);
```

### Timezone

```js
new Timezone(tz: string): Timezone
```

A timezone helper class.

**Parameters**

| @param | Type   | Description                                                            |
|:------ |:------ |:---------------------------------------------------------------------- |
| tz     | string | Timezone string, e. g. 'Z', 'GMT+3', '-0230'. Default value is '+0000' |

**Properties and methods**

|         |                                                   | Return type           | Description                                                                                                                                                                                                                                                                                                                                             |
| ------- | ------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @prop   | value                                             | string                | ISO timezone string, e. g. 'Z', '+0800', '-1130'                                                                                                                                                                                                                                                                                                        |
| @prop   | hours                                             | number (unsigned int) | integer representation of the hours part of the timezone. See toNumber() to get an integer representation of the timezone.                                                                                                                                                                                                                              |
| @prop   | minutes                                           | number (unsigned int) | integer representation of the minutes part of the timezone. See toNumber() to get an integer representation of the timezone.                                                                                                                                                                                                                            |
| @prop   | sign                                              | number (signed int)   | number representation of the prefix of the timenzone. `1` for positive, `0` for UTC and `-1` for negative timezone offset.                                                                                                                                                                                                                              |
| @prop   | prefix                                            | string                | string represenationg of the prefix, e. g. '+', 'Z' or '-'                                                                                                                                                                                                                                                                                              |
| @method | `toString()`                                      | string                | returns value                                                                                                                                                                                                                                                                                                                                           |
| @method | `toNumber(option: string, invertSign: boolean)`   | number (signed int)   | returns value as a number. The scale is provided in `option` (defaults to 'MINUTES'). Set `invertSign` to true for sign symmetry with `Date.getTimezoneOffset()` (defaults to false). Valid values for `option` are: 'MILLENIA', 'CENTURIES', 'DECADES', 'YEARS', 'QUARTERS', 'MONTHS', 'WEEKS', 'DAYS', 'HOURS', 'MINUTES', 'SECONDS', 'MILLISECONDS'. |
| @static | `fromNumber(offset: number, invertSign: boolean)` | Timezone              | Create a timezone instance from a number (in minutes)                                                                                                                                                                                                                                                                                                   |
| @static | `getPrefixFor(timezoneString: string)`            | string                | Return cleaned prefix from timezone string. returns '+' for '+', '-' for '-'/'–'/'—' and 'Z' for everything else                                                                                                                                                                                                                                        |
| @static | `getPrefixForSign(sign: number)`                  | string                | Return string prefix for number. See @prop prefix                                                                                                                                                                                                                                                                                                       |
| @static | `getSignForPrefix(timezoneString: string)`        | number                | Return number sign for string. See @prop sign                                                                                                                                                                                                                                                                                                           |

# Help and feedback

Please file issues in [Github](https://github.com/bitchcraft/timestamp/issues)

# Contribute

We are open for PRs. Please respect to the linting rules.

# License

Timestamp is free software und the BSD-3-Clause (see [LICENSE.md](./LICENSE.md)).

# Contributors

- [Josh Li](https://github.com/maddrag0n) (Maintainer)
