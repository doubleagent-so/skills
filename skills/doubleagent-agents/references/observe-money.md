# Record revenue and costs

Record what a caller paid and what serving it cost, on top of the operations from [Observe](observe.md). Revenue and
costs then show in [analytics](analytics.md) for people with the revenue permission.

## Charges and costs

In the code that handles one request:

<!-- check:ts node -->
```ts
import { createRecorder } from '@doubleagent-so/observe';

/** The ULID of the operation the settlement belongs to, kept from when it was recorded. */
declare const operationId: string;

const key = process.env.DOUBLEAGENT_AGENT_KEY;
if (!key) throw new Error('DOUBLEAGENT_AGENT_KEY is not set');
const recorder = createRecorder({ key, adapter: 'quote-api@1.0.0' });

const op = recorder.startOperation({
  protocol: { name: 'custom:quote-api', version: '1.0', binding: 'http-json' },
  direction: 'inbound',
  method: 'quotes.create',
  kind: 'tool',
});

// What serving the request cost: micros (millionths of the major unit) keep sub-cent precision.
op.cost({
  category: 'model',
  amountMicros: 4_200,
  currency: 'USD',
  basis: 'estimated',
  usage: { model: 'claude-x', input_tokens: 1200, output_tokens: 300 },
});
op.cost({ category: 'tool', amount: 0.0015, currency: 'USD', basis: 'reported' }); // decimal major units also work

// What the caller paid: an integer in minor units (500 is 5.00 USD). It returns the transaction id.
const transactionId = op.charge({ amount: 500, currency: 'USD', method: 'card', status: 'pending', basis: 'reported' });
op.finish({ outcome: 'ok' });

// Later, outside any request (a payment webhook): the same transaction id, a new status.
recorder.transaction({
  transactionId,
  protocol: 'custom:quote-api',
  operationId,
  kind: 'charge',
  amount: 500,
  currency: 'USD',
  method: 'card',
  processor: 'stripe',
  status: 'settled',
  basis: 'settled',
});
```

- `op.charge({ amount, currency, method, status, basis })` records money the caller paid. `kind` defaults to
  `charge`; a refund is `kind: 'refund'` with a negative amount.
- `op.cost({ category, amount_micros | amount, currency, basis, usage })` records a cost of serving the operation,
  in the package as `amountMicros` or `amount`. At most 16 costs per operation; later ones are dropped and counted.
- `recorder.transaction(…)` records money that is not tied to one request, such as a settlement or a refund. It needs
  `taskRef` or `operationId`, and `occurredAt` (epoch ms) must be within the last 7 days.
- `basis` says how sure the amount is: `reported` (your claim), `settled` (confirmed by a payment provider, only with
  status `settled` or `refunded`) or `estimated` (tokens times a price). Reports keep them apart.

## Limits

- Transactions within ±10^13 minor units; costs from 0 to 10^15 micros.
- A currency is an ISO 4217 code or a token symbol of 3 to 5 uppercase letters or digits.
- An invalid money event is dropped and logged, never thrown. Check what you build with `validateEvent` before
  sending it yourself.

## x402 and Stripe

- **x402:** `withA2ATelemetry` and the MCP wrappers record x402 payments automatically, as charges with
  `method: 'x402'` and `basis: 'reported'`. See [Observe A2A](observe-a2a.md) and [Observe MCP](observe-mcp.md).
- **Stripe:** revenue from Stripe is not generally available yet. Until it is, report revenue yourself with
  `op.charge` and `recorder.transaction`, or with `transaction.recorded` events over
  [raw HTTP](observe-http.md).
