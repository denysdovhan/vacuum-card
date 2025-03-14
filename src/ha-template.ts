import { HomeAssistant } from 'custom-card-helpers';
import { LitElement, TemplateResult, nothing } from 'lit';
import { property, state } from 'lit/decorators.js';

type Template = TemplateResult | string | typeof nothing;
type UnsubscribePromise = Promise<() => Promise<void>>;
type UnsubscribeError = Error & { code: string };

export class HATemplate extends LitElement {
  @property() public hass!: HomeAssistant;

  @property() public template = '';
  @property() public variables: Record<string, unknown> = {};
  @property() public value: string | null = null;
  @property() public valueResult: string | null = null;

  @state() private unsubscribePromise: UnsubscribePromise | null = null;

  public connectedCallback() {
    super.connectedCallback();

    this.updateTemplateValue();
  }

  protected updateTemplateValue() {
    if (!this.hass) {
        console.warn('hass object is not provided');
        return;
      }
  
      if (this.unsubscribePromise) {
        // Being here means that we have an update requested, but
        // a promise already exists. This can happen if the async
        // fetch hasn't completed, but more likely, it's because
        // the fetch completed, the promise is fulfilled, and we
        // want to update. So we unsubscribe and re-fetch.
        this.unsubscribeFrom(this.unsubscribePromise);
        this.unsubscribePromise = null;
      }
  
      if (!this.template) {
        return;
      }
  
      this.unsubscribePromise = this.hass.connection.subscribeMessage<{
        result: string;
      }>(
        (msg) => {
          // Save to two places because the 'value' can be updated externally.
          // This way, we know when the value has indeed changed and can
          // re-fetch the template.
          this.value = msg.result;
          this.valueResult = msg.result;
        },
        {
          type: 'render_template',
          template: this.template,
          variables: this.variables,
        }
      );
  }

  public disconnectedCallback() {
    super.disconnectedCallback();

    if (this.unsubscribePromise) {
        this.unsubscribeFrom(this.unsubscribePromise);
        this.unsubscribePromise = null;
    }
  }

  protected async unsubscribeFrom(unsubscribePromise: UnsubscribePromise) {
    try {
        const unsubscribe = await unsubscribePromise;
        return unsubscribe();
      } catch (err: unknown) {
        // We don't care when connection is closed.
        if ((err as UnsubscribeError).code !== 'not_found') {
          throw err;
        }
      }
    }

  protected render(): Template {
    // If the valueResult is null, that means the initial fetch hasn't completed or there's no template. Skip.
    // If the value isn't null and doesn't equal the result, it means we need to re-fetch.
    if (this.value && this.valueResult && this.value !== this.valueResult)
        this.updateTemplateValue();

    // Return now, and it will update with the new value later.
    return this.valueResult ?? this.value ?? nothing;
  }

}

export default function register(componentName = 'ha-template') {
  if (!customElements.get(componentName)) {
    customElements.define(componentName, HATemplate);
  }
}