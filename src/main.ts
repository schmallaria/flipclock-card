/* eslint-disable prettier/prettier */
import { LitElement, html, customElement, property, TemplateResult } from 'lit-element';
import FlipClock from 'FlipClock';
import { HomeAssistant } from 'custom-card-helpers';

import { FlipClockCardConfig, Timezone } from './types';
import { style } from './style';
import { mergeDeep } from './helpers';

import * as pjson from '../package.json';

console.info(
  `%c  FLIPCLOCK-CARD \n%c  Version ${pjson.version}  `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

@customElement('flipclock-card')
export class FlipClockCard extends LitElement {
  @property() private _hass?: HomeAssistant;
  @property() private _config!: FlipClockCardConfig;
  private _date!: Date;
  private _timezones!: Timezone[];
  private _clockFaces: string[] = ['TwentyFourHourClock', 'TwelveHourClock'];

  set hass(hass: HomeAssistant) {
    this._hass = hass;
    this._date = new Date();
  }

  public setConfig(config: FlipClockCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    this._config = mergeDeep(
      {
        title: null,
        time: {
          face: 'TwentyFourHourClock',
          showSeconds: false,
        },
        timezones: [],
        date: {
          format: {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          },
          hidden: false,
          locale: null,
        },
      },
      config,
    );

    this._timezones = [];
    this._config.timezones.forEach((item) => {
      this._timezones.push({
        id: typeof item == 'string' ? item : (item as Timezone).id,
        title: typeof item == 'string' ? item : (item as Timezone).title,
      });
    });
  }

  protected render(): TemplateResult | void {
    if (!this._config || !this._hass) {
      return html``;
    }
    return html`
      <ha-card>
        <div class="fc-content">
          ${this.showValue(this._config.title)
            ? html`
                <div class="fc-header">
                  ${this._config.title}
                </div>
              `
            : ''}
          <div class="fc-time">
            ${this.renderClock()}
          </div>
          ${this.renderDate()} ${this.renderTimezones()}
        </div>
      </ha-card>
      ${style}
    `;
  }

  protected getCardSize(): number {
    return 3;
  }

  private showValue(item): boolean {
    return typeof item !== 'undefined' && item !== null;
  }

  private renderClock(): TemplateResult {
    if (this._clockFaces.includes(this._config.time.face)) {
      const el = document.createElement('div');
      el.className = 'fc-now';
      new FlipClock(el, this._date, {
        face: this._config.time.face,
        showSeconds: this._config.time.showSeconds,
      });

      return html`${el}`;
    }
    return html``;
  }

  private renderDate(): TemplateResult {
    if (!this._config.date.hidden)
      return html` <div class="fc-date">
        ${this.formatDate(this._date)}
      </div>`;
    else return html``;
  }

  private formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
    const l = this._config.date.locale || this._hass?.language;
    const o = options || this._config.date.format;
    return date.toLocaleDateString(l, o);
  }

  private renderTimezones(): TemplateResult {
    return html`
      <div class="fc-timezone" id="fc_timezone">
        ${this._timezones.map(
          (item) => html`
            <div class="item">
              <div class="tz">
                <ha-icon class="tz-icon" icon="mdi:clock-outline"></ha-icon>
                <div class="tz-locale">${item.title}</div>
              </div>
              <div class="tz-time">
                ${this.formatDate(this._date, {
                  hour: 'numeric',
                  minute: 'numeric',
                  timeZone: item.id,
                  weekday: 'short',
                })}
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }
}
